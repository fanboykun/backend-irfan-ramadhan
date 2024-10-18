<script lang="ts">
	import { del, get, patch, post } from "$lib/client/api";
	import type { MerchantProducts } from "$lib/server/module/product";
	import type { Product } from "@prisma/client";
	import { onMount } from "svelte";

    let products: MerchantProducts = []

    onMount(async () => {
        try {
            const response = await get('merchants/products')
            products = response.data
        } catch(err) {
            console.log(err)
        }
    })

    let name = ''
    let price: number|string = ''
    let productId: string
    let processing = false
    const handleSubmitProduct = async () => {
        try {
            if(productId) return handleUpdateProduct()
            if(!name || !price) return

            processing = true
            price = Number(price)
            const data = { name, price }
            const response = await post('merchants/products', JSON.stringify(data))
            console.log(response)
            if(products) {
                products = [ response.data, ...products]
            } else { products = [ response.data ] }
        } catch (err) {
            console.log(err)
        } finally {
            name = ''
            price = ''
            processing = false
        }
    }

    const handleEditProduct = (product: Product) => {
        productId = product.id
        name = product.name
        price = product.price
    } 
    
    const handleUpdateProduct = async () => {
        try {
            if(!name || !price || !productId) return

            processing = true
            price = Number(price)
            const data = { id: productId, name, price }
            const response = await patch('merchants/products', JSON.stringify(data))
            if(products && response.data) {
                const productInList = products.findIndex(v => v.id === productId)
                if(productInList > -1) {
                    products[productInList] = response.data
                }
            } else { products = [ response.data ] }
        } catch (err) {
            console.log(err)
        } finally {
            name = ''
            price = ''
            processing = false
        }
    }

    const handleDeleteProduct = async (product: Product) => {
        try {
            processing = true
            const response = await del('merchants/products', JSON.stringify( { "id": product.id } ))
            if(response?.success && products) {
                products = products.filter(v => v.id !== product.id)
            }
        } catch(e) {
            console.log(e)
        } finally {
            processing = false
        }
    }

</script>

{#if products && products.length}
<div class="w-full flex gap-2">

    <div class="w-2/4 flex flex-col gap-2 border px-2 py-1 rounded-lg items-center justify-center">
        <h1 class="text-xl font-bold w-full text-center">--- Your Product List ---</h1>
        <div class="w-full flex flex-wrap gap-2 items-start justify-center">
            {#each products as product}
                <div class="flex flex-col gap-2 border p-2">
                    <div>Name: {product.name}</div>
                    <div>Price: {product.price}</div>
                    <div class="flex flex-row gap-2 w-full items-center justify-center">
                        <button on:click|preventDefault={() => handleDeleteProduct(product)} disabled={processing} class="w-fit px-2 py-1 border">delete</button>
                        <button on:click={() => handleEditProduct(product)} class="w-fit px-2 py-1 border">edit</button>
                    </div>
                </div>
                {/each}
        </div>
    </div>

    <div class="w-2/4 -ml-5 flex flex-col gap-2 border px-2 py-1 rounded-lg items-center">
        <h1 class="text-xl font-bold">--- Product Form ---</h1>
        <div class="flex flex-col gap-4 w-full p-4 shadow-md ">
            <input type="text" class="border px-2 py-1" bind:value={name} placeholder="input product name" name="name" id="name">
            <input type="number" class="border px-2 py-1" bind:value={price} placeholder="input product price" name="price" id="price">
            <button type="button" disabled={processing} on:click|preventDefault={handleSubmitProduct} class="border rounded-lg px-2 py-1 ">
                {processing ? 'Processing' : 'Submit'}
            </button>
        </div>
    </div>

</div>
{/if}

