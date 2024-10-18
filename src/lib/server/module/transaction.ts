import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"
import { v4 as uuid } from "uuid"

export type CreateTransactionWithProductAndPromo =
    Prisma.TransactionCreateManyInput & { 
    productTransaction: Prisma.ProductTransactionCreateManyInput[] 
    promoTransaction: Prisma.PromoTransactionCreateManyInput[] }

export type UpdateTransactionWithProductAndPromo =
    Prisma.TransactionUncheckedUpdateManyInput & { 
    productTransaction: Prisma.ProductTransactionCreateManyInput[] 
    promoTransaction: Prisma.PromoTransactionCreateManyInput[] }

export type ProductInput = { id: string; quantity: number, price: number }[]

export const getAllTransactions = async () => {
    try {
        const allTransactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return allTransactions
    }catch (err) {
        console.error(err)
        return null
    }
}

export const deleteTransaction = async (transactionId: string) => {
    try {
        await prisma.transaction.delete({
            where: { id: transactionId }
        })
        return true
    }catch (err) {
        console.error(err)
        return false
    }
}

export const addTransaction = async (data: CreateTransactionWithProductAndPromo) => {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                customerId: data.customerId,
                price_before_discount: data.price_before_discount,
                total_discount: data.total_discount,
                shipping_cost: data.shipping_cost,
                total_price: data.total_price,
                productTransaction: {
                    create: data.productTransaction.map((product) => ({
                         productId: product.productId as string,
                         quantity: product.quantity as number,
                         sub_total: product.sub_total as number,
                    }))
                 },
                 promoTransaction: {
                     create: data.promoTransaction.map(promo => ({
                         promoId: promo.promoId as string,
                     }))
                 }
            }
        })
        return transaction
    }catch (err) {
        console.error(err)
        return null
    }
}

export const updateTransactionWithRelationsOld = async (data: UpdateTransactionWithProductAndPromo) => {
    try {
        const transaction = await prisma.transaction.update({
            where: { id: data.id as string }, // Update based on the transaction ID

            data: {
                customerId: data.customerId,
                price_before_discount: data.price_before_discount,
                total_discount: data.total_discount,
                shipping_cost: data.shipping_cost,
                total_price: data.total_price,

                // Detach unused and attach new product relations
                productTransaction: {
                    set: data.productTransaction.map(product => ({
                        id: product.id // This will detach any productTransaction not included in this array
                    })),
                    connectOrCreate: data.productTransaction.map((product) => ({
                        where: { id: product.id },
                        create: {
                            productId: product.productId as string,
                            quantity: product.quantity as number,
                            sub_total: product.sub_total as number,
                        },
                    }))
                },

                // Detach unused and attach new promo relations
                promoTransaction: {
                    set: data.promoTransaction.map(promo => ({
                        id: promo.id // This will detach any promoTransaction not included in this array
                    })),
                    connectOrCreate: data.promoTransaction.map((promo) => ({
                        where: { id: promo.id },
                        create: {
                            promoId: promo.promoId as string,
                        }
                    }))
                }
            }
        });

        return transaction;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateTransactionWithRelationsOld2 = async (data: UpdateTransactionWithProductAndPromo) => {
    try {
        // Step 1: Fetch existing productTransaction records for the transaction
        const existingProductTransactions = await prisma.productTransaction.findMany({
            where: { transactionId: data.id as string }
        });

        // Step 2: Fetch existing promoTransaction records for the transaction
        const existingPromoTransactions = await prisma.promoTransaction.findMany({
            where: { transactionId: data.id as string }
        });

        // Step 3: Map productTransaction and promoTransaction IDs based on productId and promoId
        const productTransactionMap = existingProductTransactions.reduce((map, productTransaction) => {
            map[productTransaction.productId] = productTransaction.id;
            return map;
        }, {} as Record<string, string>);

        const promoTransactionMap = existingPromoTransactions.reduce((map, promoTransaction) => {
            map[promoTransaction.promoId] = promoTransaction.id;
            return map;
        }, {} as Record<string, string>);

        // Step 4: Update transaction data
        const transaction = await prisma.transaction.update({
            where: { id: data.id as string }, // Update based on the transaction ID

            data: {
                customerId: data.customerId,
                price_before_discount: data.price_before_discount,
                total_discount: data.total_discount,
                shipping_cost: data.shipping_cost,
                total_price: data.total_price,

                // Update productTransaction relations
                productTransaction: {
                    set: data.productTransaction.map(product => ({
                        id: productTransactionMap[product.productId] || undefined, // Use existing productTransactionId if found
                    })).filter(product => product.id), // Filter out undefined IDs to avoid errors

                    connectOrCreate: data.productTransaction.map(product => ({
                        where: { id: productTransactionMap[product.productId] || '' }, // Use productTransactionId if found
                        create: {
                            productId: product.productId as string,
                            quantity: product.quantity as number,
                            sub_total: product.sub_total as number,
                        },
                    }))
                },

                // Update promoTransaction relations
                promoTransaction: {
                    set: data.promoTransaction.map(promo => ({
                        id: promoTransactionMap[promo.promoId] || undefined, // Use existing promoTransactionId if found
                    })).filter(promo => promo.id), // Filter out undefined IDs to avoid errors

                    connectOrCreate: data.promoTransaction.map(promo => ({
                        where: { id: promoTransactionMap[promo.promoId] || '' }, // Use promoTransactionId if found
                        create: {
                            promoId: promo.promoId as string,
                        },
                    }))
                }
            }
        });

        return transaction;
    } catch (err) {
        console.error('Error updating transaction with relations:', err);
        return null;
    }
};

export const updateTransactionWithRelations = async (data: UpdateTransactionWithProductAndPromo) => {
    const transactionId = data.id as string;

    try {
        // Begin a transaction
        const result = await prisma.$transaction(async (tx) => {

            // Step 1: Remove productTransactions that are not in the input
            await tx.productTransaction.deleteMany({
                where: {
                    transactionId: transactionId,
                    productId: { notIn: data.productTransaction.map(product => product.productId) }
                }
            });

            // Step 2: Remove promoTransactions that are not in the input
            await tx.promoTransaction.deleteMany({
                where: {
                    transactionId: transactionId,
                    promoId: { notIn: data.promoTransaction.map(promo => promo.promoId) }
                }
            });

            // Step 3: Bulk update or insert productTransaction using createMany and then handle updates
            const existingProductTransactions = await tx.productTransaction.findMany({
                where: {
                    transactionId: transactionId,
                    productId: { in: data.productTransaction.map(product => product.productId) }
                }
            });

            const existingProductIds = existingProductTransactions.map(product => product.productId);

            // Filter new product transactions to create
            const newProductTransactions = data.productTransaction.filter(product => !existingProductIds.includes(product.productId));
            if (newProductTransactions.length > 0) {
                await tx.productTransaction.createMany({
                    data: newProductTransactions.map(product => ({
                        productId: product.productId,
                        transactionId: transactionId,
                        quantity: product.quantity,
                        sub_total: product.sub_total
                    }))
                });
            }

            // Update existing product transactions in a bulk update operation
            await Promise.all(
                existingProductTransactions.map(existingProduct => {
                    const inputProduct = data.productTransaction.find(p => p.productId === existingProduct.productId);
                    if (inputProduct) {
                        return tx.productTransaction.update({
                            where: {
                                id: existingProduct.id
                            },
                            data: {
                                quantity: inputProduct.quantity,
                                sub_total: inputProduct.sub_total
                            }
                        });
                    }
                })
            );

            // Step 4: Bulk update or insert promoTransaction using createMany and then handle updates
            const existingPromoTransactions = await tx.promoTransaction.findMany({
                where: {
                    transactionId: transactionId,
                    promoId: { in: data.promoTransaction.map(promo => promo.promoId) }
                }
            });

            const existingPromoIds = existingPromoTransactions.map(promo => promo.promoId);

            // Filter new promo transactions to create
            const newPromoTransactions = data.promoTransaction.filter(promo => !existingPromoIds.includes(promo.promoId));
            if (newPromoTransactions.length > 0) {
                await tx.promoTransaction.createMany({
                    data: newPromoTransactions.map(promo => ({
                        promoId: promo.promoId,
                        transactionId: transactionId,
                    }))
                });
            }

            // No need to update promoTransactions as they don't have additional fields to update

            // Step 5: Finally, update the main transaction without handling relations in the same query
            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    customerId: data.customerId,
                    price_before_discount: data.price_before_discount,
                    total_discount: data.total_discount,
                    shipping_cost: data.shipping_cost,
                    total_price: data.total_price
                }
            });

            return updatedTransaction;
        });
        return result
    } catch (err) {
        console.error('Error updating transaction with relations:', err);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};



export const calculatePrice = ( customerId: string,  data: ProductInput, transactionId?: string ) => {
    const transaction: CreateTransactionWithProductAndPromo = {
        id: transactionId ?? uuid(),
        customerId,
        total_price: 0,
        total_discount: 0,
        price_before_discount: 0,
        shipping_cost: getRandomNumber(),
        productTransaction: [],
        promoTransaction: []
    }

      // Iterate over each product to calculate prices
      for (const item of data) {
        const productTransaction: Prisma.ProductTransactionCreateManyInput = {
            transactionId: transaction.id as string,
            productId: item.id,
            quantity: item.quantity,
            sub_total: Math.floor(Number(item.price) * Number(item.quantity))
        } 
        transaction.productTransaction.push(productTransaction)
        const itemTotalPrice = item.price * item.quantity;
        transaction.price_before_discount += itemTotalPrice; // Add to price before discount
        transaction.total_price += itemTotalPrice; // Add to total price
    }

    return transaction

}

export const calculateTransactionWithDiscountAndShipping = async (transaction: CreateTransactionWithProductAndPromo ) => {
    const [discount, shipping] = await Promise.all([
        prisma.promo.findFirst({where: { affectOn: "PRICE" }}),
        prisma.promo.findFirst({where: { affectOn: "SHIPPING" }}),
    ])
    if(!discount || !shipping) return transaction

    if(transaction.total_price > discount.minimun) {
        const amountOfDiscount = Math.floor(transaction.price_before_discount * discount.discount / 100)
        transaction.total_discount = amountOfDiscount
        transaction.total_price = Math.floor(transaction.total_price - amountOfDiscount)

        const discount_promo_transaction: Prisma.PromoTransactionCreateManyInput = { 
            id: uuid(), 
            transactionId: transaction.id as string, 
            promoId: discount.id as string 
        }
        transaction.promoTransaction.push(discount_promo_transaction) 
    }

    if(transaction.total_price > shipping.minimun) {
        const fs_discount = Math.floor(transaction.shipping_cost as number * shipping.discount / 100)
        // transaction.total_discount += fs_discount
        transaction.shipping_cost = Math.floor(transaction.shipping_cost as number - fs_discount)

        // transaction.total_price = Math.floor(transaction.total_price - fs_discount)

        const fs_promo_transaction: Prisma.PromoTransactionCreateManyInput = { 
            id: uuid(), 
            transactionId: transaction.id as string, 
            promoId: shipping.id as string 
        }
        transaction.promoTransaction.push(fs_promo_transaction) 
    }

    return transaction
}

const getRandomNumber = (min: number = 1000, max: number = 5000): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const findTransaction = async (transactionId: string) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        })
        return transaction
    } catch (err) {
        console.error(err)
        return null
    }
}

export const getTransactionWithProducts = async (transactionId: string) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                productTransaction: true,
                promoTransaction: true,
                customer: { select: { name: true, email: true, id: true } }
            }
        })
        return transaction
    } catch (err) {
        console.error(err)
        return null
    }
}


