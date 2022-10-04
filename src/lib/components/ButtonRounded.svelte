<script lang="ts">
	export let value: string;
	export let textColor: string;
	export let backgroundColor: string;
	export let activeBackgroundColor: string;
</script>

<button
	type="button"
	class={`h-[30px] px-2 z-10 block text-center text-[10px] ${textColor} transition-all ${backgroundColor} border border-white rounded-full ${activeBackgroundColor} hover:scale-110 focus:outline-none focus:ring`}
	on:click
>
	<slot name="left" />
	<span class="font-bold tracking-wide">{value}</span>
	<slot name="right" />
</button>
