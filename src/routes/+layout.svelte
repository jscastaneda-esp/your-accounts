<script lang="ts">
	import '../app.css'
	import { Toaster } from 'svelte-sonner'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'
</script>

<slot />

<ScreenLoading />
<ConfirmPopup />
<Toaster
	position="bottom-center"
	theme="dark"
	visibleToasts={5}
	closeButton
	toastOptions={{
		class: 'alert',
		classes: {
			success: 'alert-success',
			info: 'alert-info',
			warning: 'alert-warning',
			error: 'alert-error',
			closeButton: 'btn btn-circle btn-xs no-animation border-white hover:text-black'
		}
	}}
/>
