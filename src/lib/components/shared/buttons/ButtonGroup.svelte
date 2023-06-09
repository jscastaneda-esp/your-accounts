<script lang="ts">
	import BaseButton from './BaseButton.svelte'

	export let value: string
	export let className = ''
	export let disabled = false
</script>

<BaseButton {value} className={`join-item btn-sm ${className}`} {disabled} on:click>
	<slot />
</BaseButton>
