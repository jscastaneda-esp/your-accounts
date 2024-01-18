<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import type { FelteError } from '$lib/types'

	import Input from '$components/shared/Input.svelte'
	import Button from '$components/shared/buttons/Button.svelte'

	export let index: number
	export let errors: {
		name: FelteError
		amount: FelteError
	}

	const dispatch = createEventDispatcher<{ delete: void }>()
	const prefixFieldName = `availables.${index}`
</script>

<section class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
	<Input
		id={`${prefixFieldName}.name`}
		name={`${prefixFieldName}.name`}
		label="Nombre"
		errors={errors.name}
		class="md:col-span-2 lg:col-start-2"
	/>

	<Input
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		label="Monto"
		type="number"
		alt="($)"
		errors={errors.amount}
	/>

	<Button
		value="Eliminar"
		className="btn-error btn-sm sm:col-span-2 md:col-span-1 md:col-start-2 lg:col-start-3"
		on:click={() => dispatch('delete')}
	>
		<i class="bx bxs-trash-alt" />
	</Button>
</section>
