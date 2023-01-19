<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import ItemBudgetAvailable from './ItemBudgetAvailable.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '../utils/yup.utils';
	import Toast from '../utils/toast.utils';
	import type { BudgetAvailable, Change, ConfirmPopupInfo } from '../types';
	import ConfirmPopup from './ConfirmPopup.svelte';
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum, HttpStatus } from '$lib/enums';
	import { getContext } from 'svelte';
	import type { changes as changesStore } from '../stores';
	import ChangeUtil from '$lib/classes/ChangeUtil';

	export let isValidForm: boolean;
	export let loading: boolean;
	export let list: BudgetAvailable[];
	export let budgetId: number;
	export let total: number;

	let show = false;
	let countName = list.length + 1;
	const confirmPopupInfo: ConfirmPopupInfo<{ index: number; id: number; name: string }> = {
		show: false,
		question: '¿Está seguro que desea eliminar el disponible :NAME?'
	};
	type ChangeAvailable = {
		name?: string;
		amount?: number;
	};
	const changeUtil = new ChangeUtil<keyof ChangeAvailable>();
	const { changes } = getContext<{ changes: typeof changesStore }>(ContextNameEnum.CHANGES);

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				name: defaultText.max(40),
				amount: defaultNumber.min(0).max(9999999999.99),
				budgetId: defaultNumber.min(1)
			})
		)
	});
	const { form, data, errors, isValid, touched, addField, unsetField } = createForm({
		initialValues: {
			availables: list
		},
		extend: [validator({ schema: validationSchema })]
	});

	async function handleAdd() {
		if ($isValid) {
			loading = true;

			try {
				const request = {
					name: `Disponible ${countName++}`,
					budgetId
				};

				const response = await fetch('/api/budget/available', {
					method: 'POST',
					body: JSON.stringify(request)
				});
				if (response.status != HttpStatus.OK) {
					throw new Error(response.statusText);
				}

				const body = await response.json();
				const newField = { id: body.id, name: request.name, amount: 0, budgetId };
				addField('availables', newField);
				list.push(newField);
			} catch (error) {
				Toast.error('Se presento un error al crear el disponible', true);
				throw error;
			} finally {
				loading = false;
			}
		}
	}

	function handleDelete({ detail }: { detail: { index: number; id: number; name: string } }) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = confirmPopupInfo.question.replace(':NAME', detail.name);
		confirmPopupInfo.detail = detail;
	}

	function handlePopUpAccept() {
		if (confirmPopupInfo.detail) {
			unsetField(`availables.${confirmPopupInfo.detail.index}`);
		}

		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
		confirmPopupInfo.question = '¿Está seguro que desea eliminar el disponible :NAME?';
		confirmPopupInfo.detail = undefined;
	}

	function compareData() {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_AVAILABLE,
			action: ChangeActionEnum.UPDATE
		};
		const newDatas = $data.availables;
		const dataErrors = $errors.availables || [];

		if (newDatas.length != list.length) {
			const deletes = list.filter((available) => !newDatas.some((item) => item.id == available.id));
			list = list.filter((available) => newDatas.some((item) => item.id == available.id));

			deletes.forEach((del) => {
				changes.add({
					...changeBase,
					action: ChangeActionEnum.DELETE,
					detail: {
						id: del.id
					}
				});
			});
		} else {
			for (let index = 0; index < newDatas.length; index++) {
				const newData = newDatas[index];
				const oldData = list[index];
				const errorData = dataErrors[index];

				let isChanges = false;
				const change: Change<ChangeAvailable> = {
					...changeBase,
					detail: {
						id: newData.id
					}
				};

				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'name', isChanges);
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'amount', isChanges);
				if (isChanges) {
					changes.add(change);
				}
			}
		}
	}

	$: isValidForm = $isValid;
	$: total = $data.availables.reduce((previous, current) => previous + current.amount, 0);
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
				}

				show = !show;
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`wallet ${show ? 'w-4' : 'w-5'}`}
					title="Disponible"
					value={total}
					className={show ? 'text-xs' : 'text-base'}
				/>
			</svelte:fragment>
		</ComposeHeaderCardBudget>
		<form slot="body" class="flex flex-col overflow-y-auto max-h-[210px]" use:form>
			{#each $data.availables as available, index (`available_${index}`)}
				<ItemBudgetAvailable
					{index}
					id={available.id}
					name={available.name}
					errors={$errors.availables?.[index]}
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
					<span>Agregar disponible</span>
				</button>
			{/if}
		</form>
	</CardBudget>
</div>

<ConfirmPopup
	show={confirmPopupInfo.show}
	question={confirmPopupInfo.question}
	description={confirmPopupInfo.description}
	on:accept={handlePopUpAccept}
	on:cancel={handlePopUpCancel}
/>
