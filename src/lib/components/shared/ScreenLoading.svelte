<script lang="ts">
	import { screenLoading } from '$lib/stores/shared'
</script>

{#if $screenLoading}
	<section
		class="z-[2000] fixed inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center gap-2"
	>
		<i class="bx bxs-wallet text-6xl text-primary animate-pulse" />
		<section class="flex justify-center items-center">
			<span class="loading loading-ring loading-xs text-primary" />
			<span class="loading loading-ring loading-sm text-primary" />
			<span class="loading loading-ring loading-md text-primary" />
			<span class="loading loading-ring loading-lg text-primary" />
		</section>
	</section>
{/if}
