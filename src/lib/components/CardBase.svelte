<script lang="ts">
	export let img: string | undefined = undefined;
</script>

<article
	class="shadow-sm shadow-gray-400 rounded-lg w-full min-h-[140px] p-3"
	style:background-image={img ? `url(${img})` : ''}
>
	<slot />
</article>

<style>
	article {
		background-repeat: no-repeat;
		background-position: bottom right;
		background-size: 140px;
	}
</style>
