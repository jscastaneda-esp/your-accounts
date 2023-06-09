<script lang="ts">
	export let title: string
	export let iconHeader: string
	export let iconAction: string
</script>

<button
	type="button"
	class="flex justify-between items-center text-gray-500 text-base select-none cursor-pointer w-full"
	on:click
>
	<div class="flex items-center gap-1">
		<i class={`fa-solid text-[1.2em] w-5 fa-${iconHeader} text-blue-400`} />
		<span>{title}</span>
	</div>
	<i class={`fa-solid fa-${iconAction}`} />
</button>
