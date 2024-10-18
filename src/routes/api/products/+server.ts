import { findProduct, getAllProducts } from "$lib/server/module/product"
import { parseJson } from "$lib/server/request"
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

export async function PUT(event) {
    const response = new BaseResponse()
    try {
        if(!event.locals.user) return json(response.setError(400, "no customer provided"))

        const {data, error} = await parseJson(event.request)
        if(error) return json(response.setError(400, error))

        if(!data || typeof data.id !== "string") return json(response.setError(400, "Given data is invalid"))
        const { id } = data

        const product = await findProduct(id)
        if(!product) return json(response.setError(400, "Given data is invalid"))

        return json(response.setSuccess(200, product))
    } catch(err) {
        console.error(err)
        return json(response.setInternalError())
    }
}


