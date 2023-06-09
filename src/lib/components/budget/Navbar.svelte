<script lang="ts">
	export let tab: number
</script>

<nav class="tabs tabs-boxed flex-nowrap">
	<div class="basis-full tooltip tooltip-top" data-tip="Resumen">
		<a class="tab w-full gap-x-2" href="#resume" class:tab-active={tab == 1}>
			<i class="bx bxs-spreadsheet" />
			<span class="hidden sm:block">Resumen</span>
		</a>
	</div>
	<div class="basis-full tooltip tooltip-top" data-tip="Registro">
		<a class="tab w-full gap-x-2" href="#register" class:tab-active={tab == 2}>
			<i class="bx bxs-dollar-circle" />
			<span class="hidden sm:block">Registro</span>
		</a>
	</div>
	<div class="basis-full tooltip tooltip-top" data-tip="Estadísticas">
		<a class="tab w-full gap-x-2" href="#report" class:tab-active={tab == 3}>
			<i class="bx bxs-bar-chart-alt-2" />
			<span class="hidden sm:block">Estadísticas</span>
		</a>
	</div>
</nav>
