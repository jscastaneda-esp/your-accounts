<script lang="ts">
	export let href: string
	export let active: boolean
	export let text: string
</script>

<div class="basis-full tooltip tooltip-top" data-tip={text}>
	<a class="tab w-full gap-x-2" {href} class:tab-active={active}>
		<slot />
		<span class="hidden sm:block">{text}</span>
	</a>
</div>
