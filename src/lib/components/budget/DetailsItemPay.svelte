<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import yup, { defaultBoolean, defaultNumber, defaultString } from '$utils/yup.utils'
	import Toast from '$utils/toast.utils'
	import Input from '$components/shared/Input.svelte'
	import Toggle from '$components/shared/Toggle.svelte'
	import ButtonGroup from '$components/shared/buttons/ButtonGroup.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import BudgetBillService from '$lib/services/budget/budget-bill.service'

	export let billId: number
	export let pending: number

	const service = new BudgetBillService($page)
	const dispatch = createEventDispatcher<{ pay: number }>()

	let loading = false

	// Form Definition
	const validationSchema = yup.object().shape({
		description: defaultString.max(100),
		all: defaultBoolean,
		amount: defaultNumber.min(1).max(9999999999.99)
	})
	const { form, data, errors, isValid, setFields, resetField, reset } = createForm({
		initialValues: {
			description: '',
			all: false,
			amount: 0
		},
		extend: [validator({ schema: validationSchema })]
	})

	function handleChangeAll({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			setFields('amount', pending, true)
		} else {
			resetField('amount')
		}
		setFields('all', checked, true)
	}

	async function handlePay(operation: '+' | '-') {
		loading = true

		try {
			await service.createTransaction(
				$data.description,
				$data.amount,
				operation,
				billId,
				(value) => {
					if (dispatch('pay', value)) {
						reset()
					}
				}
			)
		} catch (error) {
			Toast.error('Se presento un error al consultar los movimientos', true)
		} finally {
			loading = false
		}
	}
</script>

<form id="add" class="grid grid-cols-3 md:grid-cols-6 gap-x-2 mt-4" use:form>
	<section class="col-span-3">
		<Input
			id="description"
			name="description"
			label="Descripción"
			errors={$errors.description}
			disabled={loading}
		/>
	</section>
	<section class="pt-10 col-span-1">
		<Toggle id="all" name="all" label="Todo" disabled={loading} on:change={handleChangeAll} />
	</section>
	<section class="col-span-2">
		<Input
			id="amount"
			name="amount"
			label="Monto"
			alt="($)"
			type="number"
			errors={$errors.amount}
			disabled={$data.all || loading}
		/>
	</section>
	<section class="join flex justify-center pt-2 col-span-3 md:col-span-6">
		{#if loading}
			<Button value="" loading className="btn-neutral btn-sm" />
		{:else}
			<ButtonGroup
				value="Abonar"
				className="btn-primary"
				disabled={!$isValid}
				on:click={() => handlePay('+')}
			>
				<i class="bx bxs-plus-circle" />
			</ButtonGroup>
			<ButtonGroup
				value="Quitar"
				className="btn-secondary"
				disabled={!$isValid}
				on:click={() => handlePay('-')}
			>
				<i class="bx bxs-minus-circle" />
			</ButtonGroup>
		{/if}
	</section>
</form>
