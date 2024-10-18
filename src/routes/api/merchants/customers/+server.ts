import { getCustomersByMerchantId } from "$lib/server/module/merchat.js"
import { BaseResponse } from "$lib/server/response"
import { json } from "@sveltejs/kit"

export async function GET( { locals } ) {
    const response = new BaseResponse()
    try {
        const customersByMerchant = await getCustomersByMerchantId(locals.user?.id as string)
        response.setSuccess(200, customersByMerchant ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}