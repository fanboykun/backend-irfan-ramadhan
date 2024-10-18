import { getAllTransactions } from "$lib/server/module/transaction"
import { json } from "@sveltejs/kit"
// import type { RequestEvent } from "./$types"

export async function GET() {
    const transactions = await getAllTransactions()
    const response = {
        success: true,
        data: transactions,
    }
    return json(response)
}