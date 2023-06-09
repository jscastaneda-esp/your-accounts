<script lang="ts">
	export let message: string
</script>

<div class="grid grid-cols-[max-content_auto] items-center p-3 gap-2" role="alert">
	<slot>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-5 h-5 text-sky-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	</slot>

	<span class="text-sm">{message}</span>
</div>
