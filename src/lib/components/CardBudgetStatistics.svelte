<script lang="ts">
	import { Pie, Bar } from 'svelte-chartjs';
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
	} from 'chart.js';
	import CardBudget from './CardBudget.svelte';
	import SimpleHeaderCardBudget from './SimpleHeaderCardBudget.svelte';

	let show = false;

	ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

	const CHART_COLORS = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

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
	};

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
						const { dataset, parsed } = context;
						const total = dataset.data.reduce((previous, current) => previous + current);
						const percentage = (parsed / total) * 100;
						return `${percentage.toFixed(1)}% (${parsed})`;
					}
				}
			}
		}
	};

	const optionsBar: ChartOptions<'bar'> = {
		...(options as ChartOptions<'bar'>),
		plugins: {
			...options.plugins,
			title: {
				...options.plugins?.title,
				text: 'Balance'
			}
		}
	};

	const dataPie: ChartData = {
		labels: ['PERSONAL', 'CASA', 'AHORRO', 'FINANCIERO', 'IMPUESTOS', 'OTROS'],
		datasets: [
			{
				data: [10, 20.5, 5, 50, 6.5, 80],
				backgroundColor: Object.values(CHART_COLORS)
			}
		]
	};

	const dataBar: ChartData = {
		labels: ['PERSONAL', 'CASA', 'AHORRO', 'FINANCIERO', 'IMPUESTOS', 'OTROS'],
		datasets: [
			{
				label: 'VALOR',
				data: [12, 19, 3, 5, 2, 3],
				borderWidth: 2,
				borderColor: ['rgba(98,  182, 239, 1)']
			},
			{
				label: 'PAGO',
				data: [0, -19, 1, 4, 0, 4],
				backgroundColor: ['rgba(255, 134,159,0.4)'],
				borderColor: ['rgba(255, 134, 159, 1)']
			}
		]
	};
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<SimpleHeaderCardBudget
			slot="header"
			title="Estadísticas"
			iconHeader="chart-column"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => (show = !show)}
		/>
		<article slot="body">
			<section class="grid grid-cols-2 justify-items-center">
				<div class="chart-container">
					<Pie data={dataPie} options={optionsPie} />
				</div>
				<div class="chart-container">
					<Bar data={dataBar} options={optionsBar} />
				</div>
			</section>
		</article>
	</CardBudget>
</div>

<style lang="postcss">
	.chart-container {
		@apply col-span-2 lg:col-span-1 relative w-full h-[30rem];
	}
</style>
