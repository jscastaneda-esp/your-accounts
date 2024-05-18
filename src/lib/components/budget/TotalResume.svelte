<script lang="ts">
	import Icon from '$components/shared/Icon.svelte'
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
				<Icon className="!h-6 !w-6">
					<path
						d="M4 2V8H2V2H4M2 22V16H4V22H2M5 12C5 13.11 4.11 14 3 14C1.9 14 1 13.11 1 12C1 10.9 1.9 10 3 10C4.11 10 5 10.9 5 12M24 6V18C24 19.11 23.11 20 22 20H10C8.9 20 8 19.11 8 18V14L6 12L8 10V6C8 4.89 8.9 4 10 4H22C23.11 4 24 4.89 24 6Z"
					/>
				</Icon>
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
				<Icon className="!h-6 !w-6">
					<path
						d="M4 8H2V2H4V8M2 22H4V16H2V22M3 10C1.9 10 1 10.9 1 12C1 13.11 1.9 14 3 14C4.11 14 5 13.11 5 12C5 10.9 4.11 10 3 10M24 6V18C24 19.11 23.11 20 22 20H10C8.9 20 8 19.11 8 18V14L6 12L8 10V6C8 4.89 8.9 4 10 4H22C23.11 4 24 4.89 24 6M19.75 10.33L18.59 8.92L15 12.5L13.41 10.92L12.25 12.08L15 15.08L19.75 10.33Z"
					/>
				</Icon>
			</slot>
		</Stat>
	</article>
</section>
