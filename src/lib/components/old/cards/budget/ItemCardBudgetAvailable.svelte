<!-- <script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import ButtonRounded from '../../shared/buttons/ButtonGroup.svelte'
	import Input from '../../../shared/Input.svelte'
	import type { FelteError } from '../../../types'

	export let index: number
	export let id: number
	export let name: string
	export let errors: {
		name: FelteError
		amount: FelteError
	}

	const dispatch = createEventDispatcher<{ delete: { index: number; id: number; name: string } }>()
	const prefixFieldName = `availables.${index}`

	function handleDelete() {
		dispatch('delete', {
			index,
			id,
			name
		})
	}
</script>

<article
	class="bg-gray-200 p-[6px] grid grid-cols-6 gap-2 items-center border-b-2 border-b-gray-300"
>
	<Input
		id={`${prefixFieldName}.name`}
		name={`${prefixFieldName}.name`}
		placeholder="Nombre"
		className="col-span-3"
		errors={errors.name}
	/>
	<Input
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		placeholder="Monto ($)"
		type="number"
		className="col-span-2"
		errors={errors.amount}
	/>
	<div class="flex justify-center">
		<ButtonRounded
			textColor="text-red-800"
			backgroundColor="bg-red-200"
			activeBackgroundColor="active:bg-red-200"
			className="col-span-1"
			on:click={handleDelete}
		>
			<i class="fa-solid fa-trash" slot="left" />
		</ButtonRounded>
	</div>
</article> -->
