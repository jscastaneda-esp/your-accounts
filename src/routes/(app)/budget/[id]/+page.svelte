<script lang="ts">
	// Enums, Types, Utilities
	import { onDestroy, onMount, setContext } from 'svelte'
	import { goto } from '$app/navigation'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import type { Budget, Change } from '$lib/types'
	import yup, { defaultString, defaultNumber } from '$lib/utils/yup.utils'
	import { zeroPad } from '$lib/utils/number.utils'
	import Toast from '$lib/utils/toast.utils'
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '$lib/enums'
	import { groupBy } from '$lib/utils/array.utils'
	import { changes } from '$lib/stores'
	import ChangeUtil from '$lib/classes/ChangeUtil'

	// Components
	import Input from '$lib/components/inputs/Input.svelte'
	import ButtonLink from '$lib/components/buttons/ButtonLink.svelte'
	import PopupConfirm from '$lib/components/popups/PopupConfirm.svelte'
	import SummaryValue from '$lib/components/SummaryValue.svelte'
	import Transactions from '$lib/components/Transactions.svelte'
	import CardBudgetAvailable from '$lib/components/cards/budget/CardBudgetAvailable.svelte'
	import CardBudgetBills from '$lib/components/cards/budget/CardBudgetBills.svelte'
	import CardBudgetStatistics from '$lib/components/cards/budget/CardBudgetStatistics.svelte'
	import ScreenLoading from '$lib/components/ScreenLoading.svelte'
	import ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo'
	import { trpc } from '$lib/trpc/client'

	export let data: Budget

	let loading = false
	let showSummary = false
	let interval: ReturnType<typeof setInterval>
	let isValidAvailable = false
	let isValidBills = false
	let totalAvailable = 0
	let totalBillPending = 0
	let totalBillMaxPayment = 0
	let totalBillSavings = 0
	const confirmPopupInfo = new ConfirmPopupInfo(
		false,
		'¿Realmente desea salir?',
		'Al salir se pueden perder cambios. Se recomienda primero guardar'
	)
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo.show = false
	}
	const trpcF = trpc()
	type ChangeMain = {
		name?: string
		year?: number
		month?: number
		fixedIncome?: number
		additionalIncome?: number
	}
	const changeUtil = new ChangeUtil<keyof ChangeMain>()

	// Form Definition
	const validationSchema = yup.object().shape({
		id: defaultNumber.min(1),
		name: defaultString.max(40),
		month: defaultString.matches(new RegExp('^\\d{4}-\\d{2}$')),
		fixedIncome: defaultNumber.min(0).max(9999999999.99),
		additionalIncome: defaultNumber.min(0).max(9999999999.99)
	})
	const {
		form,
		data: dataForm,
		errors,
		isValid,
		touched
	} = createForm({
		initialValues: {
			id: data.id,
			name: data.name,
			month: `${data.year}-${zeroPad(data.month, 2)}`,
			fixedIncome: data.fixedIncome,
			additionalIncome: data.additionalIncome
		},
		extend: [validator({ schema: validationSchema })]
	})

	onMount(() => {
		interval = setInterval(() => {
			handleSave()
		}, 10000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	setContext(ContextNameEnum.CHANGES, {
		changes
	})

	async function handleSave() {
		const changeList = [...$changes]
		if ($changes.length > 0) {
			try {
				changes.delete(changeList)
				const sendChanges: Change<Record<string, unknown>>[] = []

				const groupBySection = groupBy<Change<Record<string, unknown>>>(
					changeList,
					(change) => change.section
				)
				Object.entries(groupBySection).forEach((group) => {
					const [section, items] = group
					const groupByAction = groupBy<Change<Record<string, unknown>>>(
						items,
						(change) => change.action
					)
					Object.entries(groupByAction).forEach((group) => {
						const [action, items] = group
						const groupById = groupBy<Change<Record<string, unknown>>>(items, (change) =>
							change.detail.id.toString()
						)
						Object.entries(groupById).forEach((group) => {
							const [id, items] = group

							const sendChange: Change<Record<string, unknown>> = {
								section: section as ChangeSectionEnum,
								action: action as ChangeActionEnum,
								detail: {
									id: Number(id)
								}
							}

							items.forEach(
								(item) => (sendChange.detail = { ...sendChange.detail, ...item.detail })
							)
							sendChanges.push(sendChange)
						})
					})
				})

				await trpcF.projects.receiveChanges.mutate({
					projectId: 1,
					changes: sendChanges
				})
			} catch (error) {
				changes.revert(changeList)
				Toast.error('Se presento un error al guardar', true)
				throw error
			}
		}
	}

	function handleExit() {
		confirmPopupInfo.show = true
		confirmPopupInfo.actionOk = async () => {
			loading = true
			try {
				await goto('/dashboard')
			} finally {
				loading = false
			}
		}
	}

	function compareData() {
		const newData = $dataForm
		const errorData = $errors

		let isChanges = false
		const change: Change<ChangeMain> = {
			section: ChangeSectionEnum.BUDGET_MAIN,
			action: ChangeActionEnum.UPDATE,
			detail: {
				id: data.id
			}
		}

		if (!errorData?.month) {
			const monthParts = newData.month.split('-')
			const year = Number(monthParts[0])
			const month = Number(monthParts[1])
			isChanges = changeUtil.setChangeDirect(year, data, change, 'year', isChanges)
			isChanges = changeUtil.setChangeDirect(month, data, change, 'month', isChanges)
		}

		isChanges = changeUtil.setChange(errorData, newData, data, change, 'name', isChanges)
		isChanges = changeUtil.setChange(errorData, newData, data, change, 'fixedIncome', isChanges)
		isChanges = changeUtil.setChange(
			errorData,
			newData,
			data,
			change,
			'additionalIncome',
			isChanges
		)
		if (isChanges) {
			changes.add(change)
		}
	}

	$: data.estimatedBalance = data.fixedIncome + data.additionalIncome - data.total
	$: data.totalBalance = totalAvailable - totalBillPending
	$: if ($touched) compareData()
</script>

<svelte:head>
	<title>Presupuesto | Tus Cuentas</title>
</svelte:head>

<article class="px-2 py-3 flex flex-col gap-[10px] mb-[5.2rem] md:mb-[7.6rem]">
	<section class="px-1 flex justify-between">
		<ButtonLink
			text="Guardar"
			className="text-gray-500 before:bg-gray-500 text-base"
			disabled={!$isValid || !isValidAvailable || !isValidBills || $changes.length == 0}
			on:click={handleSave}
		>
			<i class="fa-solid fa-floppy-disk" />
		</ButtonLink>
		<ButtonLink
			text="Salir"
			className="text-gray-500 before:bg-gray-500 text-base"
			on:click={handleExit}
		>
			<i class="fa-solid fa-rotate-left" />
		</ButtonLink>
	</section>
	<form
		class="w-full grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[6px] gap-x-5 p-1 border-dotted border-gray-500 border-2"
		use:form
	>
		<Input id="name" name="name" placeholder="Nombre" errors={$errors.name} />
		<Input
			id="month"
			name="month"
			placeholder="Mes (aaaa-MM)"
			type="month"
			errors={$errors.month}
		/>
		<Input
			id="fixedIncome"
			name="fixedIncome"
			placeholder="Ingreso fijo ($)"
			type="number"
			errors={$errors.fixedIncome}
		/>
		<Input
			id="additionalIncome"
			name="additionalIncome"
			placeholder="Ingreso adicional ($)"
			type="number"
			errors={$errors.additionalIncome}
		/>
	</form>
	<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
		<CardBudgetAvailable
			bind:isValidForm={isValidAvailable}
			bind:loading
			bind:total={totalAvailable}
			budgetId={data.id}
			list={data.availableBalances}
		/>
		<CardBudgetBills
			bind:isValidForm={isValidBills}
			bind:loading
			bind:total={data.total}
			bind:totalPending={totalBillPending}
			bind:totalMaxPayment={totalBillMaxPayment}
			bind:totalSavings={totalBillSavings}
			budgetId={data.id}
			budgetMonth={$dataForm.month}
			list={data.bills}
		/>
	</section>
	<CardBudgetStatistics budgetId={data.id} />
</article>

<footer class="fixed bottom-0 flex flex-col w-full">
	<Transactions projectId={data.projectId} />
	<article
		class="flex flex-col min-h-[33px] shadow-[1px_0_3px_0_rgb(0_0_0_/_0.1)] shadow-gray-700 bg-white"
	>
		<section
			class="hidden md:grid grid-cols-[repeat(auto-fit,_minmax(136px,_1fr))] items-center gap-y-[6px] gap-x-3 p-3 pb-[6px] md:pb-3"
			class:!grid={showSummary}
		>
			<SummaryValue
				icon="cash-register w-5"
				title="Pago estimado"
				value={data.total}
				className="!text-sm"
			/>
			<SummaryValue
				icon="circle-dollar-to-slot w-5"
				title="Saldo estimado"
				value={data.estimatedBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="coins w-5"
				title="Saldo total"
				value={data.totalBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="scale-unbalanced-flip w-5"
				title="Descuadre"
				value={data.totalBalance - data.estimatedBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="triangle-exclamation"
				title="Registrar"
				value={data.totalBalance -
					(data.fixedIncome + data.additionalIncome - totalBillMaxPayment) -
					totalBillSavings}
				className="!text-lg font-bold"
			/>
		</section>
		<button
			class="flex flex-col items-center justify-center h-[33px] md:hidden"
			on:click={() => (showSummary = !showSummary)}
		>
			<i
				class="fa-solid fa-angles-up text-xs text-blue-400 transition-transform"
				class:rotate-180={showSummary}
			/>
			<span class="text-gray-500 text-[10px] leading-none"
				>{#if showSummary}
					Ocultar resumen
				{:else}
					Mostrar resumen
				{/if}
			</span>
		</button>
	</article>
</footer>

{#if loading}
	<ScreenLoading />
{/if}

<PopupConfirm data={confirmPopupInfo} />
