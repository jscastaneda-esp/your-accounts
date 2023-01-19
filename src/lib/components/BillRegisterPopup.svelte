<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber, defaultBoolean } from '../utils/yup.utils';
	import { money } from '$lib/utils/number.utils';
	import Popup from './Popup.svelte';
	import Input from './Input.svelte';
	import SwitchInput from './SwitchInput.svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import { HttpStatus } from '$lib/enums';
	import type { BudgetBillTransaction } from '$lib/types';
	import Toast from '$lib/utils/toast.utils';
	import { isoToFormat } from '$lib/utils/date.utils';
	import { createEventDispatcher } from 'svelte';

	export let budgetBillId: number;
	export let pendingBill: number;

	const awaitLoad = [1, 2, 3, 4];
	const dispatch = createEventDispatcher<{ add: { payment: number } }>();
	let loading = false;
	let tab = 1;
	let transactions: BudgetBillTransaction[] = [];

	// Form Definition
	const validationSchema = yup.object().shape({
		description: defaultText.max(100),
		all: defaultBoolean,
		amount: defaultNumber.min(1).max(9999999999.99)
	});
	const { form, data, errors, isValid, setFields, resetField, reset } = createForm({
		initialValues: {
			description: '',
			all: false,
			amount: 0
		},
		extend: [validator({ schema: validationSchema })]
	});

	function handleChangeAll(event: Event) {
		const { checked } = event.currentTarget as HTMLInputElement;
		if (checked) {
			setFields('amount', pendingBill, true);
		} else {
			resetField('amount');
		}
		setFields('all', checked, true);
	}

	async function handleRegister(operation: string) {
		loading = true;

		try {
			let value: number = $data.amount;
			if (operation == '-') value *= -1;

			const response = await fetch('/api/budget/bill/transaction', {
				method: 'POST',
				body: JSON.stringify({
					description: $data.description,
					amount: value,
					budgetBillId
				})
			});
			if (response.status != HttpStatus.OK) {
				throw new Error(response.statusText);
			}

			dispatch('add', {
				payment: value
			});
			reset();
		} catch (error) {
			Toast.error('Se presento un error al consultar los movimientos', true);
			throw error;
		} finally {
			loading = false;
		}
	}

	async function showTabTransactions() {
		tab = 2;
		try {
			const response = await fetch(`/api/budget/bill/transaction?id=${budgetBillId}`);
			if (response.status != HttpStatus.OK) {
				throw new Error(response.statusText);
			}

			transactions = await response.json();
		} catch (error) {
			Toast.error('Se presento un error al consultar los movimientos', true);
			throw error;
		}
	}
</script>

<Popup open showCloseButton on:click>
	<div class="w-screen sm:w-[28rem]">
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
				<SwitchInput
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
							textColor="text-blue-500"
							backgroundColor="bg-blue-300"
							activeBackgroundColor="enabled:active:bg-blue-200"
							on:click={() => handleRegister('+')}
							disabled={!$isValid}
						>
							<i class="fa-solid fa-plus" slot="right" />
						</ButtonRounded>
						<ButtonRounded
							textColor="text-red-500"
							backgroundColor="bg-red-300"
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
						<tr class="grid grid-cols-[100px_1fr_120px] py-2 text-left font-medium text-gray-900">
							<th class="px-4">Fecha</th>
							<th class="px-4">Descripción</th>
							<th class="px-4">Monto</th>
						</tr>
					</thead>
					<tbody
						class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[173px] h-[173px] w-full"
					>
						{#each transactions as transaction}
							<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2 text-left">
								<td class="px-4">{isoToFormat(transaction.createdAt.toString(), 'dd/MM/yyyy')}</td>
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
							</tr>
						{:else}
							{#each awaitLoad as _}
								<tr class="grid grid-cols-[100px_1fr_120px] animate-pulse h-[42px]">
									<td class="bg-slate-400 m-1" />
									<td class="bg-slate-400 m-1" />
									<td class="bg-slate-400 m-1" />
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</section>
		{/if}
	</div>
</Popup>
