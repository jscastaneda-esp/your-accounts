<script lang="ts">
	export let className = ''
</script>

<div role="tablist" class={`tabs tabs-bordered mt-3 ${className}`}>
	<slot />
</div>
