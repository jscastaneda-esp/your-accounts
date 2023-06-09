<script lang="ts">
	export let className: string = ''
</script>

<article class={`card card-compact w-full shadow-xl ${className}`}>
	<main class="card-body">
		<slot />
	</main>
</article>
