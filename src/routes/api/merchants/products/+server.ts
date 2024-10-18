import { addProduct, deleteProduct, findProduct, findProductsByMerchant, updateProduct } from "$lib/server/module/product"
import { findUserById } from "$lib/server/module/user.js"
import { BaseResponse } from "$lib/server/response"
import { validateAddProduct, validateEditProduct } from "$lib/validation/productValidation"
import { json } from "@sveltejs/kit"
import { parseJson } from "$lib/server/request"

export async function GET( { locals } ) {
    const response = new BaseResponse()
    try {
        const products = await findProductsByMerchant(locals.user?.id as string)
        response.setSuccess(200, products ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}

export async function POST(event) {
    const response = new BaseResponse()
    try {
        const jsonData = await parseJson(event.request)
        if(jsonData.error) return json(response.setError(400, jsonData.error))

        const { name, price, merchantId } = jsonData.data
        const [failed, errors] = validateAddProduct(name, price, merchantId)
        if(failed) return json(response.setError(401, "Given data is invalid", errors))

        // check merchantId existance
        const merchant = await findUserById(merchantId)
        if(!merchant) return json(response.setError(401, "Merchant Does not provided"))
        
        const product = await addProduct({ name: String(name), price: Number(price), merchantId: String(merchantId) })
        if(!product) return json(response.setInternalError())

        return json(response.setSuccess(200, product))

    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}

export const PATCH = async (event) => {
    const response = new BaseResponse()
    try {
        const { error, data } = await parseJson(event.request); // Using the parseJson function
        if (error) return json(response.setError(400, error))
    
        const { id, name, price, merchantId } = data;
    
        // Validate the product data
        const [failed, errors] = validateEditProduct(id, name, price, merchantId );
        if(failed) return json(response.setError(400, "Data is not valid", errors))
        
        const existingProduct = await findProduct(id)
        if(!existingProduct) return json(response.setError(400, "Product does not found!"))
        
        const updatedProduct = await updateProduct(id, { name, price, merchantId })
        if(!updatedProduct) return json(response.setInternalError())
        
        return json(response.setSuccess(200, updatedProduct))

    } catch(err) {
        console.error(err)
        return json(response.setInternalError())
    }

};

export async function DELETE(event) {
    const response = new BaseResponse()
    try {
        const { error, data } = await parseJson(event.request)
        if (error) return json(response.setError(400, error))

        const { id } = data
        if(!id || typeof id !== 'string') return json(response.setError(400, "Given data is invalid"))
        
        const existingProduct = await findProduct(id)
        if(!existingProduct)  return json(response.setError(400, "Product does not exist"))

        const isDeleteSuccess = await deleteProduct(id)
        if(!isDeleteSuccess) return json(response.setInternalError())

        return json(response.setSuccess(200, {}))
        
    } catch(e) {
        console.error(e)
        return json(response.setInternalError())
    }
}

