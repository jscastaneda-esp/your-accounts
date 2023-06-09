<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import yup, { defaultString, defaultNumber } from '$utils/yup.utils'
	import { zeroPad } from '$utils/number.utils'
	import Input from '$components/shared/Input.svelte'
	import type { Budget, Change } from '$lib/types'
	import ChangeUtil from '$lib/classes/ChangeUtil'
	import { changes } from '$lib/stores'
	import { ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
	import ResumeData from '$components/budget/ResumeData.svelte'
	import Stat from '$components/shared/Stat.svelte'

	export let data: Budget
	export let totalPayment: number
	export let totalMaxPayment: number
	export let totalSavings: number

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

	$: if ($touched) compareData()
</script>

<section class="flex flex-col w-full">
	<form
		class="w-full grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-[6px] gap-x-5 p-2"
		use:form
	>
		<Input id="name" name="name" label="Nombre" errors={$errors.name} />
		<Input id="month" name="month" label="Mes" alt="aaaa-MM" type="month" errors={$errors.month} />
		<Input
			id="fixedIncome"
			name="fixedIncome"
			label="Ingreso fijo"
			alt="$"
			type="number"
			errors={$errors.fixedIncome}
		/>
		<Input
			id="additionalIncome"
			name="additionalIncome"
			label="Ingreso adicional"
			alt="$"
			type="number"
			errors={$errors.additionalIncome}
		/>
	</form>

	<div class="divider" />

	<section class="grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-5 pb-9">
		<ResumeData name="Pago" estimated={data.total} total={totalPayment} />
		<ResumeData name="Saldo" estimated={data.estimatedBalance} total={data.totalBalance} />
		<section class="flex justify-center items-center md:col-span-2">
			<section class="stats stats-vertical sm:grid-cols-2 shadow">
				<Stat
					title="Descuadre"
					value={data.totalBalance - data.estimatedBalance}
					className="text-xl"
				>
					<i class="bx bxs-objects-vertical-center" />
				</Stat>
				<Stat
					title="Pendiente Registrar"
					value={data.totalBalance -
						(data.fixedIncome + data.additionalIncome - totalMaxPayment) -
						totalSavings}
					className="text-xl font-bold"
				>
					<i class="bx bxs-shield-minus" />
				</Stat>
			</section>
		</section>
	</section>
</section>
