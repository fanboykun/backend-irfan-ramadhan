import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export const getAllProducts = async () => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return products
    } catch (err) {
        console.error(err)
        return null
    }
}

export const findProduct = async (productId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        })
        return product
    } catch (err) {
        console.error(err)
        return null
    }
}

export const findProductByMerchant = async (productId: string, merchantId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { 
                id: productId,
                merchantId
            },
        })
        return product
    } catch (err) {
        console.error(err)
        return null
    }
}

export const findProductsByMerchant = async (merchantId: string) => {
    try {
        const products = await prisma.product.findMany({
            where: { merchantId: merchantId },
            orderBy: { createdAt: 'desc' }
        })
        return products
    } catch (err) {
        console.error(err)
        return null
    }
}

export const getProductPriceByIds = async (productIds: string[]) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                price: true,
            },
        })
        return products
    } catch (err) {
        console.error(err)
        return null
    }
}

export const addProduct = async (data: Prisma.ProductUncheckedCreateInput) => {
    try {
        const product = await prisma.product.create({ data })
        return product
    } catch (err) {
        console.error(err)
        return null
    }
}

export const updateProduct = async (productId: string, data: Prisma.ProductUncheckedCreateInput) => {
    try {
        const product = await prisma.product.update({ 
            where: { id: productId },
            data
        })
        return product
    } catch (err) {
        console.error(err)
        return null
    }
}

export const deleteProduct = async (productId: string, merchantId: string) => {
    try {
        await prisma.product.delete({ 
            where: { id: productId, merchantId },
        })
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}