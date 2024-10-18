<script lang="ts">
	import { get } from "$lib/client/api";
	import type { TransactionsWithProductsAndPromos } from "$lib/server/module/customer";
	import { onMount } from "svelte";

    let transactions: TransactionsWithProductsAndPromos = []

    onMount(async () => {
        try {
            const res = await get('customers/transactions')
            transactions = res.data
        } catch(err) {
            console.log(err)
        }
    })
</script>
{#if transactions && transactions.length}
<h1 class="text-xl font-bold w-full text-center">--- Your Purchase List ---</h1>
<div class="w-full flex flex-wrap gap-2 items-start justify-center">
    {#each transactions as transaction}
        <div class="flex flex-col gap-2 border p-2">
            <div>shipping cost: {transaction.shipping_cost}</div>
            <div>total discount: {transaction.total_discount}</div>
            <div>total price: {transaction.total_price}</div>
            <div>total price with shipping: {transaction.total_price + (transaction.shipping_cost ?? 0) }</div>
            <div class="ml-2">
                <p>Product: </p>
                {#each transaction.productTransaction as productTransaction}
                <li>@{productTransaction.quantity} {productTransaction.product.name}  {productTransaction.sub_total}</li>
                {/each}
            </div>
        </div>
        {/each}
</div>
{/if}