import { getAllProducts } from "$lib/server/module/product"
import { BaseResponse } from "$lib/server/response"
import { json } from "@sveltejs/kit"

export async function GET() {
    const response = new BaseResponse()
    try {
        const products = await getAllProducts()
        response.setSuccess(200, products ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}


