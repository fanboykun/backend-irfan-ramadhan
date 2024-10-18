import { getCustomerInfo } from "$lib/server/module/customer.js"
import { BaseResponse } from "$lib/server/response"
import { json } from "@sveltejs/kit"

export async function GET({ locals }) {
    const response = new BaseResponse()
    try {
        const customer = await getCustomerInfo(locals.user?.id as string)
        response.setSuccess(200, customer ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }

}