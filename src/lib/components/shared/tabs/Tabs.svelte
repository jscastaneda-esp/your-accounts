<script lang="ts">
	export let className = ''
</script>

<nav class={`tabs tabs-boxed flex-nowrap rounded-b-none ${className}`}>
	<slot />
</nav>
