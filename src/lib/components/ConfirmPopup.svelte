<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Popup from './Popup.svelte';
	import Button from './Button.svelte';

	export let question: string;
	export let description: string | undefined = undefined;

	const dispatch = createEventDispatcher();
</script>

<Popup>
	<div class="w-screen sm:max-w-sm">
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
</Popup>
