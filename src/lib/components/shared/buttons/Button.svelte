<script lang="ts">
	export let type: 'button' | 'submit' = 'button'
	export let value: string
	export let className = ''
	export let disabled = false
	export let loading = false
</script>

<button class={`btn ${className}`} class:pointer-events-none={loading} {type} {disabled} on:click>
	{#if !loading}
		<slot />
		{value}
	{:else}
		<span class="loading loading-dots" />
	{/if}
</button>
