<script lang="ts">
	// Components
	import Footer from '$components/shared/Footer.svelte'
	import Header from '$components/shared/Header.svelte'
</script>

<Header />
<main class="container mx-auto mb-[52px]">
	<slot />
</main>
<Footer />
