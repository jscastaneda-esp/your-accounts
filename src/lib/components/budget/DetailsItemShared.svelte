<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import Toast from '$utils/toast.utils'
	import { confirmPopup } from '$lib/stores/shared'
	import type { BudgetBillShared } from '$lib/types'
	import Table from '$components/shared/Table.svelte'
	import Popup from '$components/shared/popup/Popup.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import { changesStore } from '$lib/stores/changes'
	import BudgetBillSharedService from '$services/budget/budget-bill-shared.service'
	import { trytm } from '@bdsqqq/try'

	export let billId: number
	export let projectId: number

	const changes = changesStore()
	const awaitLoad = [1, 2, 3, 4]
	const service = new BudgetBillSharedService($page)
	const dispatch = createEventDispatcher<{ shared: number; close: void }>()

	let loading = false
	let screenLoading = false
	let countName = 0
	let list: BudgetBillShared[] = []
	let interval: ReturnType<typeof setInterval>

	// Form Definition
	const validationSchema = yup.object().shape({
		shared: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				description: defaultString.max(200),
				amount: defaultNumber.min(1).max(9999999999.99),
				budgetBillId: defaultNumber.min(1)
			})
		)
	})
	const { form, data, errors, touched, setFields, addField, unsetField } = createForm<{
		shared: BudgetBillShared[]
	}>({
		initialValues: {
			shared: []
		},
		extend: [validator({ schema: validationSchema })]
	})

	onMount(() => {
		interval = setInterval(() => {
			handleSave()
		}, 10000)

		loading = true

		service
			.getByBudgetId(billId)
			.then((response) => {
				list = response
				countName = list.length + 1
				setFields('shared', list, true)
			})
			.catch(() => Toast.error('Se presento un error al consultar los gastos compartidos', true))
			.finally(() => (loading = false))
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	async function handleSave() {
		await service.save(projectId, [...$changes], changes, () =>
			Toast.error('Se presento un error al guardar', true)
		)
	}

	async function handleClose() {
		screenLoading = true

		const [_, error] = await trytm(handleSave())
		if (!error) dispatch('close')
		screenLoading = false
	}

	async function handleAdd() {
		screenLoading = true

		const [newField, error] = await trytm(service.create(`Gasto Compartido ${countName++}`, billId))
		if (error) {
			Toast.error('Se presento un error al crear el gasto compartido', true)
		} else {
			addField('shared', newField)
			list.push(newField)
		}
		screenLoading = false
	}

	function handleDelete({ description }: BudgetBillShared, index: number) {
		confirmPopup.show(
			`¿Está seguro que desea eliminar el gasto compartido ${description}?`,
			undefined,
			() => unsetField(`shared.${index}`)
		)
	}

	function compareData() {
		service.compareData($data.shared, $errors.shared, list, changes)
	}

	$: if ($touched) compareData()
	$: total = $data.shared.reduce((previous, current) => previous + current.amount, 0)
	$: dispatch('shared', total)
</script>

<Popup open preventDefaultClose on:click={handleClose}>
	{#if screenLoading}
		<section class="z-[2000] fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
			<span class="loading loading-ring loading-xs text-primary" />
			<span class="loading loading-ring loading-sm text-primary" />
			<span class="loading loading-ring loading-md text-primary" />
			<span class="loading loading-ring loading-lg text-primary" />
		</section>
	{/if}

	<section class="-m-6">
		<Stat title="Total" value={total} className="text-xl w-fit">
			<i class="bx bxs-coin-stack" />
		</Stat>
		<form class="border-t border-t-base-200" use:form>
			<Table className="max-h-80">
				<tr slot="head">
					<th class="text-base">Descripción</th>
					<th class="text-base">Monto ($)</th>
					<th />
				</tr>
				<svelte:fragment slot="body">
					{#if loading}
						{#each awaitLoad as _}
							<tr class="animate-pulse">
								<td><div class="bg-slate-400 h-5" /></td>
								<td><div class="bg-slate-400 h-5" /></td>
								<td><div class="bg-slate-400 h-5" /></td>
							</tr>
						{/each}
					{:else}
						{#each $data.shared as item, index (`shared_${index}`)}
							<tr>
								<td>
									<Input
										id={`shared.${index}.description`}
										name={`shared.${index}.description`}
										errors={$errors.shared?.[index].description}
									/>
								</td>
								<td>
									<Input
										id={`shared.${index}.amount`}
										name={`shared.${index}.amount`}
										type="number"
										errors={$errors.shared?.[index].amount}
									/>
								</td>
								<td class="text-center !align-middle">
									<Button
										value=""
										className="btn-error btn-sm"
										on:click={() => handleDelete(item, index)}
									>
										<i class="bx bxs-trash-alt" />
									</Button>
								</td>
							</tr>
						{/each}
					{/if}
				</svelte:fragment>
				<tr slot="foot">
					<th colspan="3" class="p-0 align-middle">
						<Button
							value="Agregar pago compartido"
							className="btn-ghost btn-block min-h-full h-full p-1 rounded-none"
							on:click={handleAdd}
						>
							<i class="bx bxs-plus-square" />
						</Button>
					</th>
				</tr>
			</Table>
		</form>
	</section>
</Popup>
