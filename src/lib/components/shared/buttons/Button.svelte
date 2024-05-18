<script lang="ts">
	export let type: 'button' | 'submit' = 'button'
	export let value = ''
	export let className = ''
	export let disabled = false
	export let loading = false
	export let outline = false
	export let block = false
</script>

<button
	class={`btn btn-sm ${className}`}
	class:pointer-events-none={loading}
	class:btn-outline={outline}
	class:btn-block={block}
	{type}
	{disabled}
	on:click
>
	{#if !loading}
		<slot />
		{value}
	{:else}
		<span class="loading loading-dots" />
		{#if value}
			Cargando
		{/if}
	{/if}
</button>
