<script lang="ts">
	import { screenLoading } from '$lib/stores/shared'
	import Icon from './Icon.svelte'
</script>

{#if $screenLoading}
	<section
		class="z-[2000] fixed inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center gap-2 text-primary"
	>
		<Icon className="!h-10 !w-10 animate-pulse">
			<path
				d="M17 3H7C4.79 3 3 4.79 3 7V17C3 19.21 4.79 21 7 21H19C20.11 21 21 20.11 21 19V9C21 7.9 20.11 7 19 7V5C19 3.9 18.11 3 17 3M17 5V7H7C6.27 7 5.59 7.2 5 7.54V7C5 5.9 5.9 5 7 5M15.5 15.5C14.67 15.5 14 14.83 14 14S14.67 12.5 15.5 12.5 17 13.17 17 14 16.33 15.5 15.5 15.5Z"
			/>
		</Icon>

		<section class="flex justify-center items-center">
			<span class="loading loading-ring loading-xs" />
			<span class="loading loading-ring loading-sm" />
			<span class="loading loading-ring loading-md" />
			<span class="loading loading-ring loading-lg" />
		</section>
	</section>
{/if}
