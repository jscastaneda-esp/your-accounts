<script lang="ts">
	import Button from './Button.svelte'

	export let value: string
	export let className = ''
	export let disabled = false
</script>

<Button {value} className={`join-item ${className}`} {disabled} on:click>
	<slot />
</Button>
