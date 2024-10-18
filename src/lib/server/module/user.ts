import prisma from "$lib/server/db"
import type { Prisma } from "@prisma/client"

export const findUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return user
    } catch(err) {
        console.error(err)
        return null
    }
}

export const findUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        return user
    } catch(err) {
        console.error(err)
        return null
    }
}

export const updateUser = async (id: string, data: Prisma.UserUncheckedCreateInput) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                password: data.password,
                email: data.email
            }
        })
        return updatedUser
    }catch (err) {
        console.error(err)
        return null
    }
}

export const deleteUser = async (id: string) => {
    try {
        await prisma.user.delete({
            where: { id },
        })
        return true
    }catch (err) {
        console.error(err)
        return false
    }
}
