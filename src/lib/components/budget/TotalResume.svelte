<script lang="ts">
	import Stat from '../shared/Stat.svelte'

	export let titleFrom: string
	export let valueFrom: number
	export let descFrom: string | null = null
	export let classNameDescFrom = ''
	export let titleTo: string
	export let valueTo: number
	export let descTo: string | null = null
	export let classNameDescTo = ''
</script>

<section class="flex justify-center items-center">
	<article class="stats stats-vertical shadow w-[500px]">
		<Stat
			title={titleFrom}
			value={valueFrom}
			className="text-lg"
			desc={descFrom}
			classDescName={classNameDescFrom}
		>
			<slot name="iconFrom">
				<i class="bx bxs-check-shield" />
			</slot>
		</Stat>
		<Stat
			title={titleTo}
			value={valueTo}
			className="text-lg"
			desc={descTo}
			classDescName={classNameDescTo}
		>
			<slot name="iconTo">
				<i class="bx bxs-coin-stack" />
			</slot>
		</Stat>
	</article>
</section>
