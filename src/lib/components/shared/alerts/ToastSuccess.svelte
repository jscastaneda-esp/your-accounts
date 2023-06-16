<script lang="ts">
	import Toast from './Toast.svelte'

	export let message: string
</script>

<Toast {message}>
	<i class="bx bxs-check-circle" />
</Toast>
