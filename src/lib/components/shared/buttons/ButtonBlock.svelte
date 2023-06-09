<script lang="ts">
	import BaseButton from './BaseButton.svelte'

	export let value: string
	export let loading = false
</script>

<BaseButton {value} className="btn-block btn-primary" {loading} on:click>
	<slot />
</BaseButton>
