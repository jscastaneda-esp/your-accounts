<script lang="ts">
	export let href: string
	export let text: string
	export let active: boolean
</script>

<a
	role="tab"
	class="tab w-full flex gap-x-2 [--fallback-bc:oklch(var(--p)/var(--tw-border-opacity))] tooltip tooltip-top tooltip-primary"
	{href}
	data-sveltekit-preload-data="hover"
	class:tab-active={active}
	data-tip={text}
>
	<slot />
	<span class="hidden sm:block">{text}</span>
</a>
