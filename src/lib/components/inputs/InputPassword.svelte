<script lang="ts">
	import Input from './Input.svelte'

	export let id: string
	export let name: string
	export let placeholder: string
	export let disabled = false
	export let errors: string[] | null = null

	let show = false

	function toggle() {
		show = !show
	}
</script>

<Input
	{id}
	{name}
	{placeholder}
	{disabled}
	readonly={show}
	type={show ? 'text' : 'password'}
	classInput="pr-9"
	{errors}
>
	<button
		tabindex="-1"
		type="button"
		class="absolute text-gray-500 cursor-pointer -translate-y-1/2 top-1/2 right-4"
		class:pointer-events-none={disabled}
		on:click={toggle}
	>
		<i class="fa-solid text-gray-500" class:fa-eye={!show} class:fa-eye-slash={show} />
	</button>
</Input>
