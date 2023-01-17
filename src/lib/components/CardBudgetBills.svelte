<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber, defaultBoolean } from '../utils/yup.utils';
	import Toast from '../utils/toast.utils';
	import ItemBudgetBill from './ItemBudgetBill.svelte';
	import type { BudgetBill, BudgetContext, BudgetMainData, CategoryBill } from '../types';
	import { DateTime } from 'luxon';

	export let isValidForm: boolean;
	export let list: BudgetBill[];

	const now = DateTime.now();

	let show = false;

	let daysMonth: number[] = [];
	let categories: CategoryBill[] = [];

	// Form Definition
	const validationSchema = yup.object().shape({
		bills: yup.array().of(
			yup.object().shape({
				description: defaultText.max(200),
				amount: defaultNumber.min(0).max(9999999999.99),
				payment: defaultNumber.min(0).max(9999999999.99),
				shared: defaultBoolean,
				due_date: yup.string().max(2),
				complete: defaultBoolean,
				budget_id: defaultNumber.min(1),
				category_id: defaultText
			})
		)
	});
	const { form, data, errors, isValid, addField, unsetField } = createForm({
		initialValues: {
			bills: list
		},
		extend: [validator({ schema: validationSchema })]
	});

	onMount(async () => {
		try {
			const response = await fetch('/api/params/category');
			if (response.status != HttpStatus.OK) {
				throw new Error(response.statusText);
			}

			categories = await response.json();
		} catch (error) {
			Toast.clear();
			Toast.error('Se presento un error al consultar los tipos de pagos');
			throw error;
		}
	});

	function add() {
		if ($isValid) {
			addField(
				'bills',
				{
					description: '',
					amount: 0,
					payment: 0,
					shared: false,
					due_date: '',
					complete: false,
					budget_id: $dataMain.id,
					category_id: ''
				},
				bills.length
			);
		}
	}

	function del({ detail }: { detail: { id: number; index: number } }) {
		if (detail.id) {
			alert('Eliminar');
		}

		unsetField(`bills.${detail.index}`);
	}

	$: isValidForm = $isValid;
	$: bills = $data.bills;
	$: monthBudget = DateTime.fromFormat($dataMain.month, 'yyyy-MM');
	$: {
		daysMonth = [];
		const daysInMonth = monthBudget.daysInMonth;
		if (!isNaN(daysInMonth)) {
			for (let day = 1; day <= daysInMonth; day++) {
				daysMonth = [...daysMonth, day];
			}
		}
	}
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<ComposeHeaderCardBudget
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => {
				Toast.clear();
				if (show && !$isValid) {
					Toast.warn('Completa la información');
					return;
				} else if (!show && !$dataMain.month) {
					Toast.warn('Mes del presupuesto obligatorio');
					return;
				}

				show = !show;
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`file-invoice-dollar ${show ? 'w-4' : 'w-5'}`}
					title="Pendiente"
					value={1000000}
					className={show ? 'text-xs' : 'text-base'}
				/>
				<SummaryValue
					icon={`cash-register ${show ? 'w-4' : 'w-5'}`}
					title="Pago total"
					value={100000}
					className={show ? 'text-xs' : 'text-base'}
				/>
			</svelte:fragment>
			<div
				slot="title-additional"
				class="flex gap-1 mt-1 items-center transition-all duration-75"
				class:text-[11px]={!show}
				class:text-[9px]={show}
			>
				<span
					class="bg-gray-200 text-center p-1 leading-none rounded font-semibold"
					class:min-w-[18px]={!show}
					class:min-w-[16px]={show}
				>
					3
				</span>
				<span class="leading-none text-gray-500">Pagos pendientes</span>
			</div>
		</ComposeHeaderCardBudget>
		<div slot="body">
			<form class="flex flex-col overflow-y-auto max-h-[400px]" use:form>
				{#each bills as bill, index (`bill_${index}`)}
					<ItemBudgetBill
						{now}
						{index}
						{monthBudget}
						{daysMonth}
						{categories}
						data={bill}
						errors={$errors.bills?.[index]}
						on:delete={del}
					/>
				{/each}
				{#if $isValid}
					<button
						type="button"
						class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
						on:click={add}
					>
						<i class="fa-solid fa-plus" />
						<span>Agregar gasto</span>
					</button>
				{/if}
			</form>
		</div>
	</CardBudget>
</div>
