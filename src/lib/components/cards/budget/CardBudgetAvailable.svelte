<script lang="ts">
	import Card from '../Card.svelte';
	import HeaderCardCompose from '../HeaderCardCompose.svelte';
	import SummaryValue from '../../SummaryValue.svelte';
	import ItemCardBudgetAvailable from './ItemCardBudgetAvailable.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultString, defaultNumber } from '../../../utils/yup.utils';
	import Toast from '../../../utils/toast.utils';
	import type { BudgetAvailable, Change } from '../../../types';
	import PopupConfirm from '../../popups/PopupConfirm.svelte';
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '../../../enums';
	import { getContext } from 'svelte';
	import type { changes as changesStore } from '../../../stores';
	import ChangeUtil from '../../../classes/ChangeUtil';
	import ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo';
	import { trpc } from '$lib/trpc/client';

	export let isValidForm: boolean;
	export let loading: boolean;
	export let list: BudgetAvailable[];
	export let budgetId: number;
	export let total: number;

	let show = false;
	let countName = list.length + 1;
	let confirmPopupInfo = new ConfirmPopupInfo(
		false,
		'¿Está seguro que desea eliminar el disponible :NAME?'
	);
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo = confirmPopupInfo.reset(
			false,
			'¿Está seguro que desea eliminar el disponible :NAME?'
		);
	};
	type ChangeAvailable = {
		name?: string;
		amount?: number;
	};
	const changeUtil = new ChangeUtil<keyof ChangeAvailable>();
	const { changes } = getContext<{ changes: typeof changesStore }>(ContextNameEnum.CHANGES);
	const trpcF = trpc();

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				name: defaultString.max(40),
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
				const newAvailable = await trpcF.budgets.availables.create.mutate(request);
				const newField = { id: newAvailable.id, amount: 0, ...request };
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
		confirmPopupInfo.actionOk = () => unsetField(`availables.${detail.index}`);
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
	<Card showBody={show}>
		<HeaderCardCompose
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
		</HeaderCardCompose>
		<form slot="body" class="flex flex-col overflow-y-auto max-h-[210px]" use:form>
			{#each $data.availables as available, index (`available_${index}`)}
				<ItemCardBudgetAvailable
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
	</Card>
</div>

<PopupConfirm data={confirmPopupInfo} />
