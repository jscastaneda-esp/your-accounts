<script lang="ts">
	import { money } from '$lib/utils/number.utils';

	export let icon: string;
	export let title: string;
	export let value: number;
</script>

<div class="flex items-center gap-1">
	<i class={`fa-solid fa-${icon} text-blue-400`} />
	<div class="flex flex-col text-xs leading-tight">
		<span class="text-gray-500">{title}</span>
		<span class="normal-nums font-semibold" class:text-red-500={value < 0}>
			{money(value)}
		</span>
	</div>
</div>
