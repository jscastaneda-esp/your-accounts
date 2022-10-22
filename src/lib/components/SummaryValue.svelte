<script lang="ts">
	import { money } from '$lib/utils/numberFormat.utils';

	export let icon: string;
	export let title: string;
	export let value: number;
	export let className = '';
</script>

<div class={`flex items-center gap-1 text-xs select-none ${className} transition-all duration-75`}>
	<i class={`fa-solid text-[1.2em] fa-${icon} text-blue-400 text-center`} />
	<div class="flex flex-col leading-tight">
		<span class="text-gray-500">{title}</span>
		<span class="normal-nums font-semibold" class:text-red-500={value < 0}>
			{money(value)}
		</span>
	</div>
</div>
