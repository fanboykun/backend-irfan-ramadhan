import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export const getAllMerchantTransaction = async (merchantId: string) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                productTransaction: {
                    some: {
                        product: {
                            merchantId: merchantId, // Filtering by merchantId
                        },
                    },
                },
            },
            include: {
                productTransaction: true, // Include product transactions if needed
                promoTransaction: true,    // Include promo transactions if needed
                customer: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return transactions;
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

export const getMerchantInfoAndProducts = async (merchantId: string) => {
    try {
        const newMerchant = await prisma.user.findFirst({
            where: { id: merchantId },
            select: {
                name: true, 
                email: true,
                products: true
            }
        })
        return newMerchant
    }catch (err) {
        console.error(err)
        return null
    }
}

export const getCustomersByMerchantId = async (merchantId: string) => {
    try {
        // Fetch transactions for the given merchant and select unique customer IDs
        const customers = await prisma.transaction.findMany({
            where: {
                productTransaction: {
                    some: {
                        product: {
                            merchantId: merchantId, // Filter transactions by merchantId
                        },
                    },
                },
            },
            select: {
                customerId: true, // Select customerId
            },
            distinct: ['customerId'], // Ensure unique customer IDs
        });

        // Extract customer IDs from the result
        const customerIds = customers.map(transaction => transaction.customerId);

        // Optionally fetch full customer details
        const uniqueCustomers = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                transactions: {
                    include: { productTransaction: true, promoTransaction: true }
                }
            },
            where: {
                id: {
                    in: customerIds, // Fetch users with matching IDs
                },
            },
        });

        return uniqueCustomers; // Return the list of unique customers
    } catch (error) {
        console.error('Error fetching customers:', error);
        return null
    }
};

export const getCustomersByMerchantIdTest = async (merchantId: string) => {
    try {
        // Fetch transactions for the given merchant and select unique customer IDs
        const customers = await prisma.transaction.findMany({
            where: {
                productTransaction: {
                    some: {
                        product: {
                            merchantId: merchantId, // Filter transactions by merchantId
                        },
                    },
                },
            },
            select: {
                customer: { select: { 
                    name: true, 
                    email: true,
                    transactions: true
                } }
            },
            distinct: ['customerId'], // Ensure unique customer IDs
        });
        return customers
    } catch (error) {
        console.error('Error fetching customers:', error);
        return null
    }
};

