<script lang="ts">
	export let iconAction: string;
</script>

<button
	type="button"
	class="flex justify-between items-center select-none cursor-pointer w-full"
	on:click
>
	<div class="flex flex-col">
		<div class="flex gap-2">
			<slot name="title" />
		</div>
		<slot name="title-additional" />
	</div>
	<i class={`fa-solid fa-${iconAction}`} />
</button>
