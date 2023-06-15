<script lang="ts">
	export let message: string
</script>

<div class="alert bg-transparent border-none gap-1 py-2">
	<slot />
	<span>{message}</span>
</div>
