import { getAllCustomerTransaction } from "$lib/server/module/customer.js"
import { getProductPriceByIds } from "$lib/server/module/product.js"
import { addTransaction, calculatePrice, calculateTransactionWithDiscountAndShipping, deleteTransaction, findTransaction, getTransactionWithProducts, updateTransactionWithRelations } from "$lib/server/module/transaction.js"
import { parseJson } from "$lib/server/request"
import { BaseResponse } from "$lib/server/response"
import { isProductArray, type ProductInput } from "$lib/validation/transactionValidation"
import { json } from "@sveltejs/kit"

export async function GET({ locals }) {
    const response = new BaseResponse()
    try {
        const transactions = await getAllCustomerTransaction(locals.user?.id as string)
        response.setSuccess(200, transactions ?? {})
        return json(response)
    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }

}

export async function POST(event) {
    const response = new BaseResponse()
    try {
        if(!event.locals.user) return json(response.setError(400, "no customer provided"))

        const jsonData = await parseJson(event.request)
        if(jsonData.error) return json(response.setError(400, jsonData.error))
            
        const isValid = isProductArray(jsonData.data)
        if(!isValid) return json(response.setError(400, "input is not valid"))

        // Collect product IDs to fetch prices in a single query
        const productInput = jsonData.data as ProductInput
        const productIdsInput = productInput.products.map(item => item.id);

        const productIdsFromDb = await getProductPriceByIds(productIdsInput)
        if(!productIdsFromDb) return json(response.setInternalError())

        // Create a mapping of product ID to its price
            // Create a mapping of product ID to its price
        const productPriceMap = productIdsFromDb.map(product => ({
            id: product.id,
            price: product.price,
            quantity: productInput.products.find(item => item.id === product.id)?.quantity || 0, // Get quantity from input data
        }));

        // return new Response('ok')
        const calulatedTransaction = calculatePrice(event.locals.user.id, productPriceMap)
        const calculatedTransactionWithDiscountAndShipping = await calculateTransactionWithDiscountAndShipping(calulatedTransaction)

        const transaction = await addTransaction(calculatedTransactionWithDiscountAndShipping)
        if(!transaction) return json(response.setInternalError())

        return json(response.setSuccess(200, transaction))

    } catch(err){
        console.error(err)
        return json(response.setInternalError())
    }
}

export async function PATCH(event) {
    const response = new BaseResponse()
    try {
        if(!event.locals.user) return json(response.setError(400, "no customer provided"))

        const jsonData = await parseJson(event.request)
        if(jsonData.error) return json(response.setError(400, jsonData.error))
            
        const isValid = isProductArray(jsonData.data)
        if(!isValid || !jsonData.data.id) return json(response.setError(400, "input is not valid"))

        // Collect product IDs to fetch prices in a single query
        const productInput = jsonData.data as ProductInput & { id: string }
        const productIdsInput = productInput.products.map(item => item.id);

        const productIdsFromDb = await getProductPriceByIds(productIdsInput)
        if(!productIdsFromDb) return json(response.setInternalError())

        // Create a mapping of product ID to its price
            // Create a mapping of product ID to its price
        const productPriceMap = productIdsFromDb.map(product => ({
            id: product.id,
            price: product.price,
            quantity: productInput.products.find(item => item.id === product.id)?.quantity || 0, // Get quantity from input data
        }));

        // return new Response('ok')
        const calulatedTransaction = calculatePrice(event.locals.user.id, productPriceMap, productInput.id)
        const calculatedTransactionWithDiscountAndShipping = await calculateTransactionWithDiscountAndShipping(calulatedTransaction)

        const transaction = await updateTransactionWithRelations(calculatedTransactionWithDiscountAndShipping)
        if(!transaction) return json(response.setInternalError())

        return json(response.setSuccess(200, transaction))

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

        const transaction = await getTransactionWithProducts(id)
        if(!transaction) return json(response.setError(400, "Given data is invalid"))

        return json(response.setSuccess(200, transaction))
    } catch(err) {
        console.error(err)
        return json(response.setInternalError())
    }
}

export async function DELETE(event) {
    const response = new BaseResponse()
    try {
        const { error, data } = await parseJson(event.request)
        if (error) return json(response.setError(400, error))

        const { id } = data
        if(!id || typeof id !== 'string') return json(response.setError(400, "Given data is invalid"))
        
        const existingProduct = await findTransaction(id)
        if(!existingProduct)  return json(response.setError(400, "Product does not exist"))

        const isDeleteSuccess = await deleteTransaction(id)
        if(!isDeleteSuccess) return json(response.setInternalError())

        return json(response.setSuccess(200, {}))
        
    } catch(e) {
        console.error(e)
        return json(response.setInternalError())
    }
}

