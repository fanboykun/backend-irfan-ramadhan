import { Prisma, PrismaClient } from '@prisma/client'
import { v4 as uuid } from "uuid"
import { faker } from '@faker-js/faker';
import { Argon2id } from 'oslo/password';

const prisma = new PrismaClient()

async function main() {
    // return await resetDb()

    const dummyUsers = await createDummyUsers()
    const users = await prisma.user.createMany({ data: dummyUsers })
    if(!users) return

    const dummyProducts = createDummyProducts(dummyUsers)
    const products = await prisma.product.createMany({ data: dummyProducts })
    if(!products) return

    const dummyPromos = createDummyPromo()
    const promos = await prisma.promo.createMany({ data: dummyPromos })
    if(!promos) return

    const dummyTransaction: 
        (Prisma.TransactionCreateManyInput & { 
        productTransaction: Prisma.ProductTransactionCreateManyInput[] 
        promoTransaction: Prisma.PromoTransactionCreateManyInput[] })[] 
     = createDummyTransaction(dummyProducts, dummyUsers, dummyPromos)

    for (const t of dummyTransaction) {
        await prisma.transaction.create({
            data: {
                id: t.id,
                customerId: t.customerId,
                price_before_discount: t.price_before_discount,
                total_discount: t.total_discount,
                shipping_cost: t.shipping_cost,
                total_price: t.total_price,
                productTransaction: {
                   create: t.productTransaction.map((product) => ({
                        productId: product.productId as string,
                        quantity: product.quantity as number,
                        sub_total: product.sub_total as number,
                   }))
                },
                promoTransaction: {
                    create: t.promoTransaction.map(promo => ({
                        promoId: promo.promoId as string,
                    }))
                }
            }
        })
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetDb = async () => {
    await prisma.productTransaction.deleteMany()
    await prisma.promoTransaction.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    await prisma.promo.deleteMany()
}

const createDummyUsers = async () => {
    const users: Prisma.UserCreateManyInput[] = []
    const password = await new Argon2id().hash('password')

    const customer: Prisma.UserCreateManyInput = {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        role: 'CUSTOMER',
    }
    const merchant: Prisma.UserCreateManyInput = {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        role: 'MERCHANT',
    }
    users.push(customer, merchant)
    return users
}

const createDummyProducts = (dummyUsers: Prisma.UserCreateManyInput[]) => {
    const merchant = dummyUsers.find((u) => u.role === 'MERCHANT') as Prisma.UserCreateManyInput
    const products: Prisma.ProductCreateManyInput[] = []
    for (let i = 0; i < 9; i++) {
        const product:Prisma.ProductCreateManyInput = {
            id: uuid(),
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price({ min: 5000, max: 20000, dec: 0 })),
            merchantId: merchant.id as string
        }
        products.push(product)
    }
    return products
}

const createDummyPromo = () => {
    const promos: Prisma.PromoCreateManyInput[] = []
    const free_shipping_cost_promo: Prisma.PromoCreateManyInput = {
        id: uuid(),
        name: 'Gratis Ongkir',
        discount: 100,
        minimun: 15000,
        affectOn: "SHIPPING"
    } 

    const ten_percen_discount: Prisma.PromoCreateManyInput = {
        id: uuid(),
        name: 'Discount 10%',
        discount: 10,
        minimun: 50000,
        affectOn: "PRICE"
    } 

    promos.push(free_shipping_cost_promo, ten_percen_discount)
    return promos
}

const createDummyTransaction = (
    dummyProducts: Prisma.ProductCreateManyInput[], 
    dummyUsers: Prisma.UserCreateManyInput[], 
    dummyPromos: Prisma.PromoCreateManyInput[]
) => {
    const transactions: Array<Prisma.TransactionCreateManyInput & { 
        productTransaction: Prisma.ProductTransactionCreateManyInput[] 
        promoTransaction: Prisma.PromoTransactionCreateManyInput[] 
    }> = []
    // const transactions: Prisma.TransactionUncheckedCreateInput[] = []

    const customer = dummyUsers.find((u) => u.role === "CUSTOMER") as Prisma.UserCreateManyInput

    const num_of_transaction = faker.number.int({ min: 5, max: 10 })
    for(let i = 0; i < num_of_transaction; i++) {
        const transaction: 
            // Prisma.TransactionUncheckedCreateInput
            Prisma.TransactionCreateManyInput & { 
            productTransaction: Prisma.ProductTransactionCreateManyInput[] 
            promoTransaction: Prisma.PromoTransactionCreateManyInput[] } 
        = {
            id: uuid(),
            customerId: customer.id as string,
            price_before_discount: 0,
            total_price: 0,
            shipping_cost: faker.number.int({ min: 2000, max: 5000 }),
            productTransaction: [],
            promoTransaction: []
        }

        const num_of_product = faker.number.int({ min: 1, max: dummyProducts.length })
        const transactionProducts: Prisma.ProductTransactionCreateManyInput[] = []

        for(let j = 0; j < num_of_product; j++) {
            const selected_product = dummyProducts[j]
            const randomQty = faker.number.int({ min: 1, max: 5 })
            const transactionProduct: Prisma.ProductTransactionCreateManyInput = {
                id: uuid(),
                transactionId: transaction.id as string,
                productId: selected_product.id as string,
                quantity: randomQty,
                sub_total: Math.floor(selected_product.price * randomQty)
            }
            transactionProducts.push(transactionProduct)
        }

        // assign price before discount
        transactionProducts.forEach(v => transaction.price_before_discount += v.sub_total)
        transaction.total_price = transaction.price_before_discount

        // check for discount
        const price_discount = dummyPromos.find(v => v.affectOn === "PRICE") as Prisma.PromoCreateManyInput
        // check if price_before_discount meet the discount's minimum
        if(transaction.price_before_discount > price_discount.minimun) {
            const discount = Math.floor(transaction.price_before_discount * price_discount.discount / 100)
            transaction.total_discount = discount
            transaction.total_price = Math.floor(transaction.total_price - discount)

            const discount_promo_transaction: Prisma.PromoTransactionCreateManyInput = { 
                id: uuid(), 
                transactionId: transaction.id as string, 
                promoId: price_discount.id as string 
            }
            transaction.promoTransaction.push(discount_promo_transaction) 
        }

        // check for free shipping
        const free_shipping = dummyPromos.find(v => v.affectOn === "SHIPPING") as Prisma.PromoCreateManyInput
        // check if price_before_discount meet the discount's minimum
        if(transaction.total_price > free_shipping.minimun) {
            const fs_discount = Math.floor(transaction.shipping_cost as number * free_shipping.discount / 100)
            // transaction.total_discount += fs_discount
            transaction.shipping_cost = Math.floor(transaction.shipping_cost as number - fs_discount)

            // transaction.total_price = Math.floor(transaction.total_price - fs_discount)

            const fs_promo_transaction: Prisma.PromoTransactionCreateManyInput = { 
                id: uuid(), 
                transactionId: transaction.id as string, 
                promoId: free_shipping.id as string 
            }
            transaction.promoTransaction.push(fs_promo_transaction) 
        }

        transaction.productTransaction.push(...transactionProducts)

        transactions.push(transaction)
    }
    return transactions
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })