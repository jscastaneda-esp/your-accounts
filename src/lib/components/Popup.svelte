<script lang="ts">
	export let showCloseButton = false;
</script>

<dialog open class="z-[100] bg-transparent" aria-modal="true">
	<div role="region" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div
		class="fixed inset-0 z-10 overflow-y-auto min-h-full flex items-end sm:items-center justify-center"
	>
		<div class="relative">
			{#if showCloseButton}
				<button
					type="button"
					class="absolute z-20 -top-4 sm:-top-3 left-0 right-0 m-auto sm:-right-3 sm:left-auto w-8 sm:w-6 h-8 sm:h-6 flex justify-center items-center border border-gray-500 rounded-full bg-white"
					on:click
				>
					<i class="fa-solid fa-xmark leading-none sm:text-xs" />
				</button>
			{/if}

			<div
				class="overflow-hidden rounded-t-lg rounded-b-none sm:rounded-b-lg bg-white shadow-xl w-full sm:max-w-2xl"
			>
				<slot />
			</div>
		</div>
	</div>
</dialog>
