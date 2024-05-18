<script lang="ts">
	export let className = ''
	export function scrollBottom() {
		if (ref) ref.scroll({ top: ref.scrollHeight, behavior: 'smooth' })
	}

	let ref: HTMLElement
</script>

<div bind:this={ref} class={`overflow-x-auto max-h-80 ${className}`}>
	<table class="table table-sm table-pin-rows">
		{#if $$slots.head}
			<thead>
				<slot name="head" />
			</thead>
		{/if}
		{#if $$slots.body}
			<tbody>
				<slot name="body" />
			</tbody>
		{/if}
		{#if $$slots.foot}
			<tfoot>
				<slot name="foot" />
			</tfoot>
		{/if}
	</table>
</div>
