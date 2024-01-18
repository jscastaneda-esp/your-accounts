<script lang="ts">
	import { getContext, tick } from 'svelte'
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
	import BudgetAvailableService from '$services/budget/budget-available.service'
	import { trytm } from '@bdsqqq/try'

	export let data: Budget

	const { changes } = getContext<{ changes: Readable<Change[]> & ChangeStore }>(
		ContextNameEnum.CHANGES
	)
	const { totalAvailable } = getContext<{ totalAvailable: Writable<number> }>(
		ContextNameEnum.BUDGET_AVAILABLES
	)
	const service = new BudgetAvailableService($page, changes)

	let refTable: Table
	let list = data.availables
	let countName = list.length + 1

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				name: defaultString.max(40),
				amount: defaultNumber.min(-9999999999.99).max(9999999999.99)
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

		const [newField, error] = await trytm(service.create(`Disponible ${countName++}`, data.id))
		if (error) {
			Toast.error('Se presento un error al crear el disponible')
		} else {
			addField('availables', newField)
			list.push(newField)
		}

		if (refTable) {
			await tick()
			refTable.scrollBottom()
		}

		screenLoading.hide()
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

<form class="bg-base-200" use:form>
	<Table bind:this={refTable} className="max-h-[calc(100vh-210px)]">
		<svelte:fragment slot="body">
			{#each $dataForm.availables as available, index (`available_${index}`)}
				<tr class="border-b-primary">
					<td>
						{#await import('$components/budget/AvailableItem.svelte')}
							<div class="skeleton w-full h-32 bg-gray-700" />
						{:then { default: AvailableItem }}
							<AvailableItem
								{index}
								errors={$errors.availables?.[index]}
								on:delete={() => handleDelete(available, index)}
							/>
						{/await}
					</td>
				</tr>
			{:else}
				<tr>
					<td class="align-middle text-center"> Registra tu primer disponible </td>
				</tr>
			{/each}
		</svelte:fragment>
		<tr slot="foot">
			<th colspan="3" class="p-0 align-middle bg-base-200">
				<Button
					value="Agregar disponible"
					className="btn-primary btn-block btn-xs text-sm rounded-none"
					on:click={handleAdd}
				>
					<i class="bx bxs-plus-square text-lg" />
				</Button>
			</th>
		</tr>
	</Table>
</form>
