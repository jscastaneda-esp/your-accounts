<script lang="ts">
	import { Pie, Bar } from 'svelte-chartjs'
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		BarElement,
		CategoryScale,
		LinearScale,
		type ChartData,
		type ChartOptions,
		type TooltipItem
	} from 'chart.js'
	import Card from '../Card.svelte'
	import HeaderCardSimple from '../HeaderCardSimple.svelte'
	import Toast from '$utils/toast.utils'
	import { trpc } from '../../../trpc/client'

	export let budgetId: number

	ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

	const CHART_COLORS = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	}
	const options: ChartOptions = {
		maintainAspectRatio: false,
		layout: {
			padding: 20
		},
		plugins: {
			title: {
				display: true,
				font: {
					size: 20
				}
			},
			legend: {
				position: 'bottom'
			}
		}
	}
	const optionsPie: ChartOptions<'pie'> = {
		...(options as ChartOptions<'pie'>),
		plugins: {
			...options.plugins,
			title: {
				...options.plugins?.title,
				text: 'Distribución gastos'
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
		}
	}
	const trpcF = trpc()
	let show = false
	let loading = false
	let dataPie: ChartData<'pie', number[], unknown> | null
	let dataBar: ChartData<'bar', (number | [number, number])[], unknown> | null

	async function handleShow() {
		show = !show

		dataPie = null
		dataBar = null
		if (show) {
			loading = true
			try {
				const chartData = await trpcF.budgets.getStatisticsById.query(budgetId)
				dataPie = {
					labels: chartData.labels,
					datasets: [
						{
							data: chartData.pie.data,
							backgroundColor: Object.values(CHART_COLORS)
						}
					]
				}

				dataBar = {
					labels: chartData.labels,
					datasets: [
						{
							label: 'VALOR',
							data: chartData.bar.amount.data,
							borderWidth: 2,
							borderColor: ['rgba(98,  182, 239, 1)']
						},
						{
							label: 'PAGO',
							data: chartData.bar.payment.data,
							backgroundColor: ['rgba(255, 134,159,0.4)'],
							borderColor: ['rgba(255, 134, 159, 1)']
						}
					]
				}
			} catch (error) {
				Toast.error('Se presento un error al consultar las transacciones', true)
				throw error
			} finally {
				loading = false
			}
		}
	}
</script>

<div class="px-1">
	<Card showBody={show}>
		<HeaderCardSimple
			slot="header"
			title="Estadísticas"
			iconHeader="chart-column"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={handleShow}
		/>
		<article slot="body">
			<section class="grid grid-cols-2 justify-items-center">
				<div class="chart-container" class:!h-auto={!dataPie?.datasets[0].data.length}>
					{#if loading}
						<div
							class="p-5 w-full h-full flex flex-col gap-2 justify-center items-center animate-pulse"
						>
							<div class="w-1/2 h-6 mb-2 bg-slate-400" />
							<div class="w-[350px] h-[350px] bg-slate-400 rounded-full" />
							<div class="w-full h-5 bg-slate-400" />
						</div>
					{:else if !dataPie?.datasets[0].data.length}
						<h1 class="w-full p-5 text-center">No se encontró información</h1>
					{:else}
						<Pie data={dataPie} options={optionsPie} />
					{/if}
				</div>
				<div class="chart-container" class:!h-auto={!dataBar?.datasets[0].data.length}>
					{#if loading}
						<div
							class="p-5 w-full h-full flex flex-col gap-2 justify-center items-center animate-pulse"
						>
							<div class="w-1/2 h-6 mb-2 bg-slate-400" />
							<div class="w-full h-[350px] bg-slate-400" />
							<div class="w-full h-5 bg-slate-400" />
						</div>
					{:else if !dataBar?.datasets[0].data.length}
						<h1 class="w-full p-5 text-center">No se encontró información</h1>
					{:else}
						<Bar data={dataBar} options={optionsBar} />
					{/if}
				</div>
			</section>
		</article>
	</Card>
</div>

<style lang="postcss">
	.chart-container {
		@apply col-span-2 lg:col-span-1 relative w-full h-[30rem];
	}
</style>
