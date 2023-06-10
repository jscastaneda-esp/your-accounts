<script lang="ts">
	import BaseToast from './BaseToast.svelte'

	export let message: string
</script>

<BaseToast {message}>
	<i class="bx bxs-info-circle" />
</BaseToast>
