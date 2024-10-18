import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export const getAllMerchantTransaction = async (merchantId: string) => {
    try {
        const userWithTransaction = await prisma.user.findMany({
            where: { id: merchantId },
            select: {
                transactions: {
                    include: {
                        productTransaction: { include: { product: true } },
                        promoTransaction: { include: { promo: true } }
                    }
                } 
            },
            orderBy: { createdAt: 'desc' }
        })
        return userWithTransaction
    }catch (err) {
        console.error(err)
        return null
    }
}

export const addMerchant = async (data: Prisma.UserUncheckedCreateInput) => {
    try {
        const newMerchant = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "MERCHANT"
            }
        })
        return newMerchant
    }catch (err) {
        console.error(err)
        return null
    }
}

