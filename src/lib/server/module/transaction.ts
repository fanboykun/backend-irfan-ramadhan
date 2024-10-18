import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export type CreateTransactionWithProductAndPromo =
    Prisma.TransactionCreateManyInput & { 
    productTransaction: Prisma.ProductTransactionCreateManyInput[] 
    promoTransaction: Prisma.PromoTransactionCreateManyInput[] }

export type UpdateTransactionWithProductAndPromo =
    Prisma.TransactionUncheckedUpdateManyInput & { 
    productTransaction: Prisma.ProductTransactionCreateManyInput[] 
    promoTransaction: Prisma.PromoTransactionCreateManyInput[] }

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


