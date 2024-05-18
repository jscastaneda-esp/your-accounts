<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import Toast from '$utils/toast.utils'
	import BudgetBillService from '$services/budget/budget-bill.service'
	import { trytm } from '@bdsqqq/try'
	import TextInput from '$components/shared/TextInput.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Icon from '$components/shared/Icon.svelte'
	import Tooltip from '$components/shared/Tooltip.svelte'

	export let billId: number
	export let pending: number

	const service = new BudgetBillService($page)
	const dispatch = createEventDispatcher<{ pay: number }>()

	let loading = false

	// Form Definition
	const validationSchema = yup.object().shape({
		description: defaultString.max(100),
		amount: defaultNumber.min(1).max(9999999999.99)
	})
	const { form, data, errors, isValid, setFields, reset } = createForm({
		initialValues: {
			description: '',
			amount: 0
		},
		extend: [validator({ schema: validationSchema })]
	})

	function handlePayAll() {
		setFields('description', 'Pago', true)
		setFields('amount', pending)
		handlePay('+')
	}

	async function handlePay(operation: '+' | '-') {
		loading = true

		const [value, error] = await trytm(
			service.createTransaction($data.description, $data.amount, operation, billId)
		)
		if (error) {
			Toast.error('Se presento un error al registrar el movimiento')
		} else {
			if (dispatch('pay', value)) {
				reset()

				if (operation == '+') {
					Toast.success('Se realizo el abono con éxito')
				} else {
					Toast.success('Se realizo la disminución con éxito')
				}
			}
		}

		loading = false
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article
	tabindex="0"
	class="collapse collapse-open bg-base-100 w-full sm:w-fit shadow shadow-primary"
>
	<main class="collapse-content">
		<form id="add" class="grid grid-cols-1 md:grid-cols-5 gap-[6px] mt-4" use:form>
			<section class="md:col-span-3 flex gap-x-2">
				<Tooltip text="Pagar pendiente" direction="right" disabled={!pending || loading}>
					<Button
						className="btn-square btn-success"
						{loading}
						disabled={!pending}
						on:click={handlePayAll}
					>
						<Icon>
							<path
								d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
							/>
						</Icon>
					</Button>
				</Tooltip>

				<TextInput
					id="description"
					name="description"
					placeholder="Descripción"
					errors={$errors.description}
					disabled={loading}
				>
					<Icon slot="icon">
						<path
							d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z"
						/>
					</Icon>
				</TextInput>
			</section>

			<section class="md:col-span-2 flex gap-x-2">
				<TextInput
					id="amount"
					name="amount"
					placeholder="Monto"
					type="number"
					errors={$errors.amount}
					disabled={loading}
				>
					<Icon slot="icon">
						<path
							d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"
						/>
					</Icon>
				</TextInput>

				<Tooltip text="Ingresar" direction="left" disabled={!$isValid || loading}>
					<Button
						className="btn-square btn-primary"
						{loading}
						disabled={!$isValid}
						on:click={() => handlePay('+')}
					>
						<Icon>
							<path
								d="M15 15V17H18V20H20V17H23V15H20V12H18V15M14.97 11.61C14.85 10.28 13.59 8.97 12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61M13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z"
							/>
						</Icon>
					</Button>
				</Tooltip>

				<Tooltip text="Retirar" direction="left" disabled={!$isValid || loading}>
					<Button
						className="btn-square btn-secondary"
						{loading}
						disabled={!$isValid}
						on:click={() => handlePay('-')}
					>
						<Icon>
							<path
								d="M15 15V17H23V15M14.97 11.61C14.85 10.28 13.59 8.97 12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61M13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z"
							/>
						</Icon>
					</Button>
				</Tooltip>
			</section>
		</form>
	</main>
</article>
