<script lang="ts">
	export let className = ''
</script>

<div class={`overflow-x-auto max-h-80 ${className}`}>
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
