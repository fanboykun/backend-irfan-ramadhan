<script lang="ts">
	import { goto } from "$app/navigation";
	import { get, post } from "$lib/client/api";
	import { onMount } from "svelte";

    let products: { id: string, merchantId: string, name: string, price: number }[]|undefined
    let cart: { id: string, quantity: number, name: string }[] = []

    onMount(async () => {
        try {
            const res = await get('products')
            products = res.data
        } catch(err) {
            console.log(err)
        }
    })

    const handleAddProductToCart = (product: { id: string, merchantId: string, name: string, price: number }, isAdding: boolean = true ) => {
        const isExist = cart.findIndex(p => p.id === product.id)
        if(isExist > -1) {
            if(isAdding) {
                cart[isExist].quantity += 1
            } else {
                if(cart[isExist].quantity - 1 == 0) {
                    cart = cart.filter(v => v.id !== cart[isExist].id )
                }else {
                    cart[isExist].quantity -= 1
                }
            }
        } else {
            const newCart = {
                id: product.id,
                quantity: 1,
                name: product.name,
            }
    
            cart = [...cart, newCart]
        }
    }

    const handleIncreaseOrDecreaseQuantity = (product: { id: string, quantity: number, name: string }, isAdding: boolean = true) => {
        const isExist = cart.findIndex(p => p.id === product.id)
        if(isExist > -1) {
            if(isAdding) {
                cart[isExist].quantity += 1
            } else {
                if(cart[isExist].quantity - 1 == 0) {
                    cart = cart.filter(v => v.id !== cart[isExist].id )
                }else {
                    cart[isExist].quantity -= 1
                }
            }
        }
    }

    let processing = false
    const handleSubmitTransaction = async () => {
        try {
            processing = true
            const data = { "products": [...cart] }
            const strdata = JSON.stringify(data)
            const res = await post('customers/transactions', strdata)
            if(res?.success) return goto('/customers')
        } catch (e) {
            console.log(e)
        } finally {
            processing = false
            cart = []
        }
    }

</script>
{#if products && products.length}
<div class="w-full flex gap-2">
    <div class="w-2/4 flex flex-col gap-2 border px-2 py-1 rounded-lg items-center justify-center">
        <h1 class="text-xl font-bold">--- Product List ---</h1>
            {#each products as product}
                <div class="px-2 py-1.5 rounded-xl border flex items-center justify-center gap-2">
                    {product.name}: {product.price}
                    <button type="button" on:click={() => handleAddProductToCart(product)} class="px-1 border">+</button>
                </div>
            {/each}
    </div>
    <div class="w-2/4 -ml-5 flex flex-col gap-2 border px-2 py-1 rounded-lg items-center">
        <h1 class="text-xl font-bold">--- Cart ---</h1>
        {#if cart.length}
        <div class="h-full flex flex-col gap-5">

            {#each cart as cartProduct}
                <div class="px-2 py-1.5 rounded-xl border w-fit flex items-center justify-center gap-2">
                    <button type="button" class="px-1 border" on:click={() => handleIncreaseOrDecreaseQuantity(cartProduct, false)}>-</button>
                    {cartProduct.name}: {cartProduct.quantity}
                    <button type="button" class="px-1 border" on:click={() => handleIncreaseOrDecreaseQuantity(cartProduct)}>+</button>
                </div>
            {/each}
            <div>
            </div>
            <button type="button" disabled={processing} on:click|preventDefault={handleSubmitTransaction} class="border rounded-lg px-2 py-1 ">
                {processing ? 'Processing' : 'Submit'}
            </button>
        </div>
        {/if}
    </div>
</div>
{/if}