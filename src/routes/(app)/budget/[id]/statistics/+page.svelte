<script lang="ts">
	import {
		ArcElement,
		BarElement,
		CategoryScale,
		Chart as ChartJS,
		Legend,
		LinearScale,
		Title,
		Tooltip,
		type ChartOptions,
		type TooltipItem,
		type ChartData
	} from 'chart.js'
	import { getContext } from 'svelte'
	import { Bar, Pie } from 'svelte-chartjs'
	import Table from '$components/shared/Table.svelte'
	import { money } from '$utils/number.utils'
	import type { BudgetStatistics } from '$lib/types'
	import { ContextNameEnum } from '$lib/enums'
	import type { Readable } from 'svelte/store'

	ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

	const CHART_COLORS = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)',
		white: 'rgb(255, 255, 255)'
	}
	const options: ChartOptions = {
		maintainAspectRatio: false,
		responsive: true,
		layout: {
			padding: 20
		},
		plugins: {
			title: {
				display: true,
				font: {
					size: 20
				},
				color: 'hsl(145 0% 81%/1)'
			},
			legend: {
				position: 'bottom',
				labels: {
					color: 'hsl(145 0% 81%/1)'
				}
			}
		}
	}
	const optionsPie: ChartOptions<'pie'> = {
		...(options as ChartOptions<'pie'>),
		plugins: {
			...options.plugins,
			title: {
				...options.plugins?.title,
				text: 'Distribución Estimada'
			},
			tooltip: {
				callbacks: {
					label: function (context: TooltipItem<'pie'>) {
						const { dataset, parsed } = context
						const total = dataset.data.reduce((previous, current) => previous + current)
						const percentage = (parsed / total) * 100
						return `${percentage.toFixed(1)}% (${parsed})`
					}
				}
			}
		}
	}
	const optionsBar: ChartOptions<'bar'> = {
		...(options as ChartOptions<'bar'>),
		plugins: {
			...options.plugins,
			title: {
				...options.plugins?.title,
				text: 'Balance'
			}
		},
		scales: {
			x: {
				ticks: {
					color: 'hsl(145 0% 81%/1)'
				}
			},
			y: {
				ticks: {
					color: 'hsl(145 0% 81%/1)'
				}
			}
		}
	}

	const { statistics: statisticsBills } = getContext<{ statistics: Readable<BudgetStatistics> }>(
		ContextNameEnum.BUDGET_BILLS
	)

	let dataPie: ChartData<'pie', number[], unknown> | null
	let dataBar: ChartData<'bar', (number | [number, number])[], unknown> | null
	let balanceData: {
		category: string
		estimated: number
		payment: number
		differenceIcon: string
		difference: number
	}[] = []

	$: {
		const { categories, data } = $statisticsBills

		dataPie = {
			labels: categories,
			datasets: [
				{
					data: data.amount,
					backgroundColor: Object.values(CHART_COLORS),
					borderColor: Object.values(CHART_COLORS)
				}
			]
		}

		dataBar = {
			labels: categories,
			datasets: [
				{
					label: 'ESTIMADO',
					data: data.amount,
					borderWidth: 2,
					backgroundColor: ['#f28c18'],
					borderColor: ['#f28c18']
				},
				{
					label: 'PAGO',
					data: data.payment,
					backgroundColor: ['#e2e063'],
					borderColor: ['#e2e063']
				}
			]
		}

		for (let index = 0; index < categories.length; index++) {
			const estimated = data.amount[index]
			const payment = data.payment[index]
			const difference = data.amount[index] - data.payment[index]

			let differenceIcon = ''
			if (difference > 0) {
				differenceIcon = '↗︎'
			} else if (difference < 0) {
				differenceIcon = '↘︎'
			}

			balanceData.push({
				category: categories[index],
				estimated,
				payment,
				differenceIcon,
				difference
			})
		}
		balanceData = balanceData
	}
</script>

<section class="p-4 bg-base-200">
	<section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<article>
			{#if !dataPie?.datasets[0].data.length}
				<h1 class="w-full p-5 text-center">No se encontró información</h1>
			{:else}
				<Pie data={dataPie} options={optionsPie} />
			{/if}
		</article>
		<article>
			{#if !dataBar?.datasets[0].data.length}
				<h1>No se encontró información</h1>
			{:else}
				<Bar data={dataBar} options={optionsBar} />
			{/if}
		</article>
	</section>

	<section class="mt-4 bg-base-100">
		<Table>
			<tr slot="head">
				<th>Categoría</th>
				<th>Estimado</th>
				<th>Pago</th>
				<th>Diferencia</th>
			</tr>
			<svelte:fragment slot="body">
				{#each balanceData as data}
					<tr class="hover">
						<td>{data.category}</td>
						<td>{money(data.estimated)}</td>
						<td>{money(data.payment)}</td>
						<td>
							<div
								class="badge gap-1"
								class:badge-success={data.difference > 0}
								class:badge-error={data.difference < 0}
								class:badge-outline={data.difference == 0}
							>
								{#if data.differenceIcon}
									<span>{data.differenceIcon}</span>
								{/if}
								{money(data.difference)}
							</div>
						</td>
					</tr>
				{/each}
			</svelte:fragment>
		</Table>
	</section>
</section>

<style lang="postcss">
	section article {
		@apply flex justify-center items-center border border-base-content border-opacity-20 rounded-box shadow bg-base-100 min-h-[24rem];
	}
</style>
