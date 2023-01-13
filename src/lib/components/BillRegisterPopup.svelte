<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber, defaultBoolean } from '../utils/yup.utils';
	import { money } from '$lib/utils/numberFormat.utils';
	import Popup from './Popup.svelte';
	import Input from './Input.svelte';
	import SwitchInput from './SwitchInput.svelte';
	import ButtonRounded from './ButtonRounded.svelte';

	export let pendingBill: number;

	let tab = 1;

	// Form Definition
	const validationSchema = yup.object().shape({
		description: defaultText.max(100),
		all: defaultBoolean,
		amount: defaultNumber.min(0).max(9999999999.99)
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

	function handleRegister(operation: string) {
		let value: number = $data.amount;
		if (operation == '-') {
			value *= -1;
		}

		alert(value);
		reset();
	}
</script>

<Popup showCloseButton on:click>
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
				<a class="relative block py-1.5 px-4" href="#transactions" on:click={() => (tab = 2)}>
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
				/>
				<SwitchInput
					id="all"
					name="all"
					text="Todo"
					className="col-span-2"
					on:change={handleChangeAll}
				/>
				<Input
					id="amount"
					name="amount"
					placeholder="Monto ($)"
					type="number"
					errors={$errors.amount}
					className="col-span-4"
					disabled={$data.all}
				/>
				<section class="flex justify-evenly col-span-2">
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
		{/if}
		{#if tab == 2}
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
						class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[130px] h-[130px] w-full"
					>
						<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2 text-left">
							<td class="px-4">26/08/2022</td>
							<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 1 </td>
							<td class="px-4">
								<strong
									class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-green-100 text-green-700"
								>
									{money(10000)}
								</strong>
							</td>
						</tr>
						<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2 text-left">
							<td class="px-4">26/08/2022</td>
							<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 2 </td>
							<td class="px-4">
								<strong
									class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-red-100 text-red-700"
								>
									{money(-5000)}
								</strong>
							</td>
						</tr>
						<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2 text-left">
							<td class="px-4">26/08/2022</td>
							<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 3 </td>
							<td class="px-4">
								<strong
									class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-green-100 text-green-700"
								>
									{money(100000)}
								</strong>
							</td>
						</tr>
						<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2 text-left">
							<td class="px-4">26/08/2022</td>
							<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 4 </td>
							<td class="px-4">
								<strong
									class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-red-100 text-red-700"
								>
									{money(-1000000)}
								</strong>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		{/if}
	</div>
</Popup>
