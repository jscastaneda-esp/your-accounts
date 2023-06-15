<script lang="ts">
	import Button from './Button.svelte'

	export let value: string
	export let loading = false
</script>

<Button {value} className="btn-block btn-primary" {loading} on:click>
	<slot />
</Button>
