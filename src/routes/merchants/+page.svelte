<script lang="ts">
	import { get } from "$lib/client/api";
	import type { CustomersByMerchat } from "$lib/server/module/merchat";
	import { onMount } from "svelte";

    let customers: CustomersByMerchat = []

    onMount(async () => {
        try {
            const response = await get('merchants/customers')
            customers = response.data
            console.log(customers)
        } catch(err) {
            console.log(err)
        }
    })
</script>

{#if customers && customers.length}
<h1 class="text-xl font-bold w-full text-center">--- Your Buyer List ---</h1>
<div class="w-full flex flex-wrap gap-2 items-start justify-center">
    {#each customers as customer}
        <div class="flex flex-col gap-2 border p-2">
            <div>Name: {customer.name}</div>
            <div>Email: {customer.email}</div>
            <div>Total Product: {customer.transactions.length}</div>
        </div>
        {/each}
</div>
{/if}

