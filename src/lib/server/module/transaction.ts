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

export const updateTransactionWithRelations = async (data: UpdateTransactionWithProductAndPromo) => {
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


