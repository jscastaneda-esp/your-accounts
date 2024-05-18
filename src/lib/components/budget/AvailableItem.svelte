<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import type { FelteError } from '$lib/types'

	import TextInput from '$components/shared/TextInput.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Icon from '$components/shared/Icon.svelte'
	import Tooltip from '$components/shared/Tooltip.svelte'

	export let index: number
	export let errors: {
		name: FelteError
		amount: FelteError
	}

	const dispatch = createEventDispatcher<{ delete: void }>()
	const prefixFieldName = `availables.${index}`
</script>

<section class="w-full grid grid-cols-1 md:grid-cols-5 gap-[6px] gap-x-5">
	<TextInput
		id={`${prefixFieldName}.name`}
		name={`${prefixFieldName}.name`}
		placeholder="Nombre"
		errors={errors.name}
		class="md:col-span-3"
	>
		<Icon slot="icon">
			<path
				d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z"
			/>
		</Icon>
	</TextInput>

	<section class="flex md:col-span-2 gap-x-2">
		<TextInput
			id={`${prefixFieldName}.amount`}
			name={`${prefixFieldName}.amount`}
			placeholder="Monto"
			type="number"
			errors={errors.amount}
		>
			<Icon slot="icon">
				<path
					d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"
				/>
			</Icon>
		</TextInput>

		<Tooltip text="Eliminar" direction="left">
			<Button className="btn-square btn-error" on:click={() => dispatch('delete')}>
				<Icon>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</Icon>
			</Button>
		</Tooltip>
	</section>
</section>
