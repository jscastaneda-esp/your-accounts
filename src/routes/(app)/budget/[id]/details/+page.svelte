<script lang="ts">
	import { getContext } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import type { Budget, BudgetAvailable, Change, ChangeStore } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import { screenLoading, confirmPopup } from '$lib/stores/shared'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import { ContextNameEnum } from '$lib/enums'
	import type { Readable, Writable } from 'svelte/store'

	import Table from '$components/shared/Table.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Input from '$components/shared/Input.svelte'
	import BudgetAvailableService from '$services/budget/budget-available.service'

	export let data: Budget

	const prefixFieldName = `availables`
	const { changes } = getContext<{ changes: Readable<Change<unknown>[]> & ChangeStore<unknown> }>(
		ContextNameEnum.CHANGES
	)
	const { totalAvailable } = getContext<{ totalAvailable: Writable<number> }>(
		ContextNameEnum.BUDGET_AVAILABLES
	)
	const service = new BudgetAvailableService($page, changes)

	let list = data.availableBalances
	let countName = list.length + 1

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
	})
	const {
		form,
		data: dataForm,
		errors,
		touched,
		addField,
		unsetField
	} = createForm({
		initialValues: {
			availables: list
		},
		extend: [validator({ schema: validationSchema })]
	})

	async function handleAdd() {
		screenLoading.show()

		try {
			const newField = await service.create(`Disponible ${countName++}`, data.id)
			addField('availables', newField)
			list.push(newField)
		} catch (error) {
			Toast.error('Se presento un error al crear el disponible', true)
		} finally {
			screenLoading.hide()
		}
	}

	function handleDelete(available: BudgetAvailable, index: number) {
		confirmPopup.show(
			`¿Está seguro que desea eliminar el disponible ${available.name}?`,
			undefined,
			() => unsetField(`availables.${index}`)
		)
	}

	function compareData() {
		service.compareData($dataForm.availables, $errors.availables, list)
	}

	$: if ($touched) compareData()
	$: totalAvailable.set(
		$dataForm.availables.reduce((previous, current) => previous + current.amount, 0)
	)
</script>

<form class="my-2 bg-base-100" use:form>
	<Table className="max-h-[calc(100vh-300px)]">
		<tr slot="head">
			<th class="text-base">Nombre</th>
			<th class="text-base">Monto ($)</th>
			<th />
		</tr>
		<svelte:fragment slot="body">
			{#each $dataForm.availables as available, index (`available_${index}`)}
				<tr>
					<td>
						<Input
							id={`${prefixFieldName}.${index}.name`}
							name={`${prefixFieldName}.${index}.name`}
							errors={$errors.availables?.[index].name}
						/>
					</td>
					<td>
						<Input
							id={`${prefixFieldName}.${index}.amount`}
							name={`${prefixFieldName}.${index}.amount`}
							type="number"
							errors={$errors.availables?.[index].amount}
						/>
					</td>
					<td class="text-center !align-middle">
						<Button
							value=""
							className="btn-error btn-sm"
							on:click={() => handleDelete(available, index)}
						>
							<i class="bx bxs-trash-alt" />
						</Button>
					</td>
				</tr>
			{/each}
		</svelte:fragment>
		<tr slot="foot">
			<th colspan="3" class="p-0 align-middle">
				<Button
					value="Agregar disponible"
					className="btn-ghost btn-block min-h-full h-full p-1 rounded-none"
					on:click={handleAdd}
				>
					<i class="bx bxs-plus-square" />
				</Button>
			</th>
		</tr>
	</Table>
</form>

<style lang="postcss">
	td {
		@apply align-top;
	}
</style>
