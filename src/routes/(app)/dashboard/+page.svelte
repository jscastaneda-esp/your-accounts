<script lang="ts">
	// Utilities
	import { goto } from '$app/navigation';
	import Toast from '$lib/utils/toast.utils';

	// Components
	import CardBase from '$lib/components/CardBase.svelte';
	import CardProject from '$lib/components/CardProject.svelte';

	// Types, Enums
	import { TypeProject } from '$lib/enums';

	const awaitLoad = [1, 2, 3];
	let showNewProject = false;

	async function getProjects() {
		try {
			const response = await fetch('/api/dashboard');
			if (response.status != 200) {
				throw new Error(response.statusText);
			}

			const projects = await response.json();
			return projects;
		} catch (error) {
			Toast.clear();
			Toast.error('Se presento un error al consultar los proyectos');
			throw error;
		}
	}

	function handleNewProject(type: TypeProject) {
		let url: string | undefined = undefined;
		if (TypeProject.BUDGET === type) {
			url = '/budget';
		}
		alert('Creando proyecto');
		goto(`${url}/${new Date().getTime()}`);
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div
	class="container mx-auto justify-around grid grid-cols-[repeat(auto-fit,_minmax(276px,_300px))] gap-[22px] p-[22px]"
>
	{#await getProjects()}
		<CardBase>
			<div class="animate-pulse">
				<div class="bg-slate-400 w-full h-[140px]" />
			</div>
		</CardBase>
		{#each awaitLoad as _}
			<CardBase>
				<div class="animate-pulse">
					<div class="w-full flex justify-end">
						<div class="rounded-full bg-slate-400 h-4 w-[43px]" />
					</div>
					<div class="-mt-1 mb-1 bg-slate-400 w-4/5 h-6" />
					<div class="rounded-lg bg-slate-400 w-full h-7" />
					<div class="w-full flex justify-end mt-4">
						<div class="flex items-center -space-x-4">
							<div class="z-10 block w-[70px] h-[30px] rounded-full bg-slate-400" />
							<div class="z-10 block w-[70px] h-[30px] rounded-full bg-slate-400" />
						</div>
					</div>
				</div>
			</CardBase>
		{/each}
	{:then data}
		<CardBase>
			<button
				type="button"
				class="flex justify-center items-center gap-2 text-gray-400 font-bold w-full h-full select-none cursor-pointer"
				on:click={() => (showNewProject = !showNewProject)}
			>
				<i class="fa-solid fa-plus text-6xl" />
				<span class="text-3xl text-center w-min">Crear Proyecto</span>
			</button>

			<div class="relative block transition-[display]" class:hidden={!showNewProject}>
				<div
					class="absolute -right-3 z-30 mt-4 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg p-[6px] w-48 text-sm"
					role="menu"
				>
					<a
						class="block rounded-lg py-[6px] px-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 no-underline"
						role="menuitem"
						on:click={() => handleNewProject(TypeProject.BUDGET)}
						href={'#'}
					>
						<i class="fa-solid fa-cash-register" />
						<span class="ml-2 tracking-wider font-semibold">Presupuesto</span>
					</a>
				</div>
			</div>
		</CardBase>

		{#each data as project (project.id)}
			<CardProject {...project} />
		{/each}
	{/await}
</div>
