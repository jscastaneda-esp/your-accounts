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
	import type { BudgetBill, CategoryBill, ConfirmPopupInfo } from '../types';
	import { DateTime } from 'luxon';
	import { ContextNameEnum, HttpStatus } from '$lib/enums';
	import type { changes as changesStore } from '../stores';
	import ConfirmPopup from './ConfirmPopup.svelte';

	export let isValidForm: boolean;
	export let loading: boolean;
	export let list: BudgetBill[];
	export let budgetId: number;
	export let budgetMonth: string;

	const now = DateTime.now();
	let show = false;
	let daysMonth: number[] = [];
	let categories: CategoryBill[] = [];
	let countName = list.length + 1;
	const confirmPopupInfo: ConfirmPopupInfo<{ index: number; id: number; description: string }> = {
		show: false,
		question: '¿Está seguro que desea eliminar el gasto :DESC?'
	};
	const { changes } = getContext<{ changes: typeof changesStore }>(ContextNameEnum.CHANGES);

	// Form Definition
	const validationSchema = yup.object().shape({
		bills: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				description: defaultText.max(200),
				amount: defaultNumber.min(0).max(9999999999.99),
				payment: defaultNumber.min(0).max(9999999999.99),
				shared: defaultBoolean,
				dueDate: yup.string().max(2),
				complete: defaultBoolean,
				budgetId: defaultNumber.min(1),
				categoryId: defaultText
			})
		)
	});
	const { form, data, errors, isValid, touched, addField, unsetField } = createForm({
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
			Toast.error('Se presento un error al consultar los tipos de pagos', true);
			throw error;
		}
	});

	async function handleAdd() {
		if ($isValid) {
			loading = true;

			try {
				const request = {
					description: `Gasto ${countName++}`,
					budgetId
				};

				const response = await fetch('/api/budget/bill', {
					method: 'POST',
					body: JSON.stringify(request)
				});
				if (response.status != HttpStatus.OK) {
					throw new Error(response.statusText);
				}

				const body = await response.json();
				const newField = {
					id: body.id,
					description: request.description,
					amount: 0,
					payment: 0,
					shared: false,
					dueDate: '',
					complete: false,
					budgetId,
					categoryId: ''
				};
				addField('bills', newField);
				list.push(newField);
			} catch (error) {
				Toast.error('Se presento un error al crear el gasto', true);
				throw error;
			} finally {
				loading = false;
			}
		}
	}

	function handleDelete({
		detail
	}: {
		detail: { index: number; id: number; description: string };
	}) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = confirmPopupInfo.question.replace(':DESC', detail.description);
		confirmPopupInfo.detail = detail;
	}

	function handlePopUpAccept() {
		if (confirmPopupInfo.detail) {
			unsetField(`bills.${confirmPopupInfo.detail.index}`);
		}

		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
		confirmPopupInfo.question = '¿Está seguro que desea eliminar el gasto :DESC?';
		confirmPopupInfo.detail = undefined;
	}

	function compareData() {
		// FIXME Pendiente
	}

	$: isValidForm = $isValid;
	$: monthBudget = DateTime.fromFormat(budgetMonth, 'yyyy-MM');
	$: {
		daysMonth = [];
		const daysInMonth = monthBudget.daysInMonth;
		if (!isNaN(daysInMonth)) {
			for (let day = 1; day <= daysInMonth; day++) {
				daysMonth = [...daysMonth, day];
			}
		}
	}
	$: totalPayment = $data.bills.reduce((previous, current) => previous + current.payment, 0);
	$: total = $data.bills.reduce((previous, current) => previous + current.amount, 0);
	$: if ($touched) compareData();
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<ComposeHeaderCardBudget
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => {
				if (show && !$isValid) {
					Toast.warn('Completa la información', true);
					return;
				} else if (!show && !budgetMonth) {
					Toast.warn('Mes del presupuesto obligatorio', true);
					return;
				}

				show = !show;
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`file-invoice-dollar ${show ? 'w-4' : 'w-5'}`}
					title="Pendiente"
					value={total - totalPayment}
					className={show ? 'text-xs' : 'text-base'}
				/>
				<SummaryValue
					icon={`cash-register ${show ? 'w-4' : 'w-5'}`}
					title="Pago total"
					value={totalPayment}
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
				{#each $data.bills as bill, index (`bill_${index}`)}
					<ItemBudgetBill
						{now}
						{index}
						{monthBudget}
						{daysMonth}
						{categories}
						data={bill}
						errors={$errors.bills?.[index]}
						on:delete={handleDelete}
					/>
				{/each}
				{#if $isValid}
					<button
						type="button"
						class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
						on:click={handleAdd}
					>
						<i class="fa-solid fa-plus" />
						<span>Agregar gasto</span>
					</button>
				{/if}
			</form>
		</div>
	</CardBudget>
</div>

<ConfirmPopup
	show={confirmPopupInfo.show}
	question={confirmPopupInfo.question}
	description={confirmPopupInfo.description}
	on:accept={handlePopUpAccept}
	on:cancel={handlePopUpCancel}
/>
