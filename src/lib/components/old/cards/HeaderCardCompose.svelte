<!-- <script lang="ts">
	export let iconAction: string | null = null
	export let clickable = true
</script>

<button
	type="button"
	class="flex justify-between items-center select-none w-full"
	class:cursor-pointer={clickable}
	class:pointer-events-none={!clickable}
	on:click
>
	<div class="flex flex-col">
		<div class="flex gap-2">
			<slot name="title" />
		</div>
		<slot name="title-additional" />
	</div>
	{#if iconAction}
		<i class={`fa-solid fa-${iconAction}`} />
	{/if}
</button> -->
