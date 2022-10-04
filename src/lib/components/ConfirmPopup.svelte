<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let question: string;
	export let description: string | undefined = undefined;

	const dispatch = createEventDispatcher();
</script>

<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center text-center sm:items-center">
			<div
				class="relative transform overflow-hidden rounded-t-lg rounded-b-none sm:rounded-b-lg bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-xs"
			>
				<div class="bg-white pt-6 px-6">
					<h3 class="text-lg font-medium leading-6 text-black" id="modal-title">
						{question}
					</h3>
					{#if description}
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								{description}
							</p>
						</div>
					{/if}
				</div>
				<div class="bg-gray-50 p-4 flex items-center justify-between">
					<Button
						value="Aceptar"
						className="h-max w-32 shadow-none"
						classNameValue="tracking-wide text-base"
						on:click={() => dispatch('accept')}
					/>
					<Button
						value="Cancelar"
						className="ml-2 h-max w-32 shadow-none bg-transparent active:bg-gray-500 hover:bg-gray-400 hover:bg-opacity-20"
						classNameValue="tracking-wide text-base"
						on:click={() => dispatch('cancel')}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
