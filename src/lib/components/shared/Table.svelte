<script lang="ts">
	export let className = ''
	export function scrollBottom() {
		if (ref) ref.scroll({ top: ref.scrollHeight, behavior: 'smooth' })
	}

	let ref: HTMLElement
</script>

<div bind:this={ref} class={`overflow-x-auto max-h-80 ${className}`}>
	<table class="table table-pin-rows">
		<thead>
			<slot name="head" />
		</thead>
		<tbody>
			<slot name="body" />
		</tbody>
		<tfoot>
			<slot name="foot" />
		</tfoot>
	</table>
</div>
