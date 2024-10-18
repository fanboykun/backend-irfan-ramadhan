import { getAllMerchantTransaction } from "$lib/server/module/merchat.js"
import { BaseResponse } from "$lib/server/response"
import { json } from "@sveltejs/kit"

export async function GET( { locals } ) {
    const response = new BaseResponse()
    try {
        const transactions = await getAllMerchantTransaction(locals.user?.id as string)
        response.setSuccess(200, transactions ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}