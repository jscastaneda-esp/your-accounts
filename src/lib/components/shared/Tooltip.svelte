<script lang="ts">
	export let text: string
	export let direction: 'top' | 'right' | 'bottom' | 'left' = 'top'
	export let className = ''
	export let disabled = false
</script>

<div
	class="{className} tooltip {direction} tooltip-primary"
	class:pointer-events-none={disabled}
	data-tip={text}
>
	<slot />
</div>

<style lang="postcss">
	.top {
		@apply tooltip-left;
	}

	.right {
		@apply tooltip-right;
	}

	.bottom {
		@apply tooltip-bottom;
	}

	.left {
		@apply tooltip-left;
	}
</style>
