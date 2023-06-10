<!-- <script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { createEventDispatcher } from 'svelte'
	import yup, { defaultString, defaultNumber, defaultBoolean } from '$utils/yup.utils'
	import { money } from '$utils/number.utils'
	import Popup from '../../shared/Popup.svelte'
	import Input from '../../../shared/Input.svelte'
	import InputSwitch from '../../inputs/InputSwitch.svelte'
	import ButtonRounded from '../../shared/buttons/ButtonGroup.svelte'
	import type { BudgetBillTransaction } from '../../../types'
	import Toast from '$utils/toast.utils'
	import dayjs from '$utils/dayjs.utils'
	import { trpc } from '../../../trpc/client'

	export let budgetBillId: number
	export let pendingBill: number

	const awaitLoad = [1, 2, 3, 4]
	const dispatch = createEventDispatcher<{ add: { payment: number } }>()
	const trpcF = trpc()
	let loading = false
	let tab = 1
	let loadTransactions = false
	let transactions: BudgetBillTransaction[] = []

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

	function handleChangeAll(event: Event) {
		const { checked } = event.currentTarget as HTMLInputElement
		if (checked) {
			setFields('amount', pendingBill, true)
		} else {
			resetField('amount')
		}
		setFields('all', checked, true)
	}

	async function handleRegister(operation: string) {
		loading = true

		try {
			let value: number = $data.amount
			if (operation == '-') value *= -1

			await trpcF.budgets.bills.createTransaction.mutate({
				description: $data.description,
				amount: value,
				budgetBillId
			})
			dispatch('add', {
				payment: value
			})
			reset()
		} catch (error) {
			Toast.error('Se presento un error al consultar los movimientos', true)
			throw error
		} finally {
			loading = false
		}
	}

	async function showTabTransactions() {
		tab = 2
		loadTransactions = true
		try {
			transactions = await trpcF.budgets.bills.getTransactionsById.query(budgetBillId)
		} catch (error) {
			Toast.error('Se presento un error al consultar los movimientos', true)
			throw error
		} finally {
			loadTransactions = false
		}
	}
</script>

<Popup open showCloseButton on:click>
	<div class="w-screen sm:w-[30rem]">
		<ul class="grid grid-cols-2 border-b-2 border-gray-200 text-gray-500">
			<li>
				<a class="relative block py-1.5 px-4" href="#add" on:click={() => (tab = 1)}>
					<span
						class="absolute inset-x-0 -bottom-[2px] h-[2px] w-full transition-colors ease-in-out"
						class:bg-blue-400={tab == 1}
					/>

					<div class="flex items-center justify-center gap-3 font-semibold">
						<i class="fa-solid fa-plus" />
						<span class="text-sm">Agregar</span>
					</div>
				</a>
			</li>
			<li>
				<a class="relative block py-1.5 px-4" href="#transactions" on:click={showTabTransactions}>
					<div class="flex items-center justify-center gap-3 font-semibold">
						<span
							class="absolute inset-x-0 -bottom-[2px] h-[2px] w-full transition-colors ease-in-out"
							class:bg-blue-400={tab == 2}
						/>
						<i class="fa-solid fa-list" />
						<span class="text-sm">Movimientos</span>
					</div>
				</a>
			</li>
		</ul>
		{#if tab == 1}
			<form id="add" class="grid grid-cols-8 items-center gap-2 p-[6px]" use:form>
				<Input
					id="description"
					name="description"
					placeholder="Descripción"
					errors={$errors.description}
					className="col-span-8"
					disabled={loading}
				/>
				<InputSwitch
					id="all"
					name="all"
					text="Todo"
					className="col-span-2"
					disabled={loading}
					on:change={handleChangeAll}
				/>
				<Input
					id="amount"
					name="amount"
					placeholder="Monto ($)"
					type="number"
					errors={$errors.amount}
					className="col-span-4"
					disabled={$data.all || loading}
				/>
				<section class="flex justify-evenly col-span-2">
					{#if loading}
						<button
							type="button"
							class={`w-[30px] h-[30px] flex justify-center items-center bg-gray-500/80 pointer-events-none rounded-full`}
							disabled
						>
							<svg
								class="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						</button>
					{:else}
						<ButtonRounded
							textColor="text-blue-800"
							backgroundColor="bg-blue-300"
							activeBackgroundColor="enabled:active:bg-blue-200"
							on:click={() => handleRegister('+')}
							disabled={!$isValid}
						>
							<i class="fa-solid fa-plus" slot="right" />
						</ButtonRounded>
						<ButtonRounded
							textColor="text-red-800"
							backgroundColor="bg-red-200"
							activeBackgroundColor="enabled:active:bg-red-200"
							on:click={() => handleRegister('-')}
							disabled={!$isValid}
						>
							<i class="fa-solid fa-minus" slot="left" />
						</ButtonRounded>
					{/if}
				</section>
				<section
					class="flex flex-col items-start justify-center col-span-8 px-2 pb-2 text-gray-500 text-xs"
				>
					<p>Indique la operación a realizar:</p>
					<p>
						<i class="fa-solid fa-plus text-[0.8em]" />
						Realizar pago
					</p>
					<p>
						<i class="fa-solid fa-minus text-[0.8em]" />
						Disminuir pago
					</p>
				</section>
			</form>
		{:else if tab == 2}
			<section id="transactions">
				<table class="w-full divide-y-2 divide-gray-200 text-sm">
					<thead>
						<tr class="grid grid-cols-[1fr_120px_161px] py-2 text-left font-medium text-gray-900">
							<th class="px-4">Descripción</th>
							<th class="px-4">Monto</th>
							<th class="px-4">Registrado</th>
						</tr>
					</thead>
					<tbody
						class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[173px] h-[173px] w-full"
					>
						{#if loadTransactions}
							{#each awaitLoad as _}
								<tr class="grid grid-cols-[1fr_120px_161px] animate-pulse h-[42px]">
									<td class="bg-slate-400 m-1" />
									<td class="bg-slate-400 m-1" />
									<td class="bg-slate-400 m-1" />
								</tr>
							{/each}
						{:else}
							{#each transactions as transaction}
								<tr class="grid grid-cols-[1fr_120px_161px] text-gray-900 py-2 text-left">
									<td class="px-4 max-h-[26px] text-clip overflow-hidden"
										>{transaction.description}</td
									>
									<td class="px-4">
										<strong
											class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-green-100 text-green-700"
											class:bg-red-100={transaction.amount < 0}
											class:text-red-700={transaction.amount < 0}
										>
											{money(transaction.amount)}
										</strong>
									</td>
									<td class="px-4">{dayjs(transaction.createdAt).fromNow()}</td>
								</tr>
							{:else}
								<tr class="grid justify-center p-4 font-semibold">
									<td colspan="2">No se han registrado movimientos</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</section>
		{/if}
	</div>
</Popup> -->
