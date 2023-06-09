<script lang="ts">
	import Stat from '../shared/Stat.svelte'

	export let name: string
	export let estimated: number
	export let total: number

	let progress = (total * 100) / estimated
	if (progress > 100) {
		progress = 100
	} else if (progress < 0) {
		progress = 0
	}

	const residue = estimated - total
	let desc = ''
	if (residue < 0) {
		desc = `↗︎ ${Math.abs(residue)}`
	} else if (residue > 0) {
		desc = `↘︎ ${Math.abs(residue)}`
	}
</script>

<article class="flex flex-col items-center gap-4">
	<h2>{name}</h2>

	<section
		class="radial-progress bg-primary text-primary-content border-4 border-primary"
		style={`--value:${progress};`}
	>
		{progress}%
	</section>

	<div class="stats shadow grid-cols-2">
		<Stat title="Estimado" value={estimated}>
			<i class="bx bxs-check-shield" />
		</Stat>
		<Stat title="Total" value={total} {desc}>
			<i class="bx bxs-coin-stack" />
		</Stat>
	</div>
</article>
