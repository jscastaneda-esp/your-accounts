<!-- <script lang="ts">
	import type { BudgetBill } from '$lib/types'
	import PopupBillRegister from '../../popups/budget/PopupBillRegister.svelte'
	import PopupBillShared from '../../popups/budget/PopupBillShared.svelte'

	export let data: BudgetBill

	let optionRegister = 0

	function handleShowOption(option: number) {
		optionRegister = optionRegister != option ? option : 0
	}

	function handleRegisterBill({ detail }: { detail: { payment: number } }) {
		data.payment += detail.payment
	}

	function handleChangeTotalShared({ detail }: { detail: number }) {
		data.totalShared = detail
	}

	$: pending = data.complete ? 0 : data.amount - data.payment
</script>

{#if optionRegister == 1}
	<PopupBillRegister
		budgetBillId={data.id}
		pendingBill={pending}
		on:click={() => handleShowOption(1)}
		on:add={handleRegisterBill}
	/>
{:else if optionRegister == 2}
	<PopupBillShared
		budgetBillId={data.id}
		on:click={() => handleShowOption(2)}
		on:changeTotal={handleChangeTotalShared}
	/>
{/if} -->
