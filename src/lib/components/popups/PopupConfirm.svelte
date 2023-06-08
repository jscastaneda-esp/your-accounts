<script lang="ts">
	import Popup from './Popup.svelte'
	import Button from '../buttons/Button.svelte'
	import type ConfirmPopupInfo from '../../classes/ConfirmPopupInfo'

	export let data: ConfirmPopupInfo

	async function handleOk() {
		await Promise.resolve(data.actionOk())
		await Promise.resolve(data.actionCancel())
	}
</script>

<Popup open={data.show}>
	<div class="w-screen sm:max-w-sm">
		<div class="bg-white pt-6 px-6">
			<h3 class="text-lg font-medium leading-6 text-black text-center" id="modal-title">
				{data.question}
			</h3>
			{#if data.description}
				<p class="text-sm text-gray-500 mt-2">
					{data.description}
				</p>
			{/if}
		</div>
		<div class="bg-gray-50 p-4 flex items-center justify-between">
			<Button
				value="Aceptar"
				className="h-max w-32 shadow-none"
				classNameValue="tracking-wide text-base"
				on:click={handleOk}
			/>
			<Button
				value="Cancelar"
				className="ml-2 h-max w-32 shadow-none bg-transparent active:bg-gray-500 hover:bg-gray-400 hover:bg-opacity-20"
				classNameValue="tracking-wide text-base"
				on:click={data.actionCancel}
			/>
		</div>
	</div>
</Popup>
