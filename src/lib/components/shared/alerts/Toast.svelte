<script lang="ts">
	export let message: string
</script>

<div class="alert bg-transparent border-none text-sm text-neutral-content gap-y-0 gap-x-2 p-2 pr-0">
	<span class="text-3xl sm:text-4xl leading-none">
		<slot />
	</span>
	<span>{message}</span>
</div>
