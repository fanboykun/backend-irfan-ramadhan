import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export type TransactionsWithProductsAndPromos = Prisma.PromiseReturnType<typeof getAllCustomerTransaction>

export const getAllCustomerTransaction = async (customerId: string) => {
    try {
        const customerTransactions = await prisma.transaction.findMany({
            where: { customerId },
            include: {
                productTransaction: {
                    include: { 
                        product: { 
                            include: { 
                                merchant: { 
                                    select: {
                                        name: true,
                                        id: true
                                    } 
                                } 
                            }    
                        } 
                    }
                },
                promoTransaction: {
                    include: { promo: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return customerTransactions
    }catch (err) {
        console.error(err)
        return null
    }
}

export const addCustomer = async (data: Prisma.UserUncheckedCreateInput) => {
    try {
        const newMerchant = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "CUSTOMER"
            }
        })
        return newMerchant
    }catch (err) {
        console.error(err)
        return null
    }
}

export const getCustomerInfo = async (customerId: string) => {
    try {
        const newMerchant = await prisma.user.findUnique({
            where: {
                id: customerId,
                role: "CUSTOMER"
            },
            select: {
                name: true,
                email: true
            }
        })
        return newMerchant
    }catch (err) {
        console.error(err)
        return null
    }
}