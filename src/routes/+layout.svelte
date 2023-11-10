<script lang="ts">
	import '../app.css'
	import 'boxicons/css/boxicons.min.css'
	import { Toaster } from 'svelte-sonner'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'
</script>

<slot />

<ScreenLoading />
<ConfirmPopup />
<Toaster position="bottom-center" theme="dark" visibleToasts={5} closeButton />
