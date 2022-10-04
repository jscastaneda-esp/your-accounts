<script lang="ts">
	// Components
	import CardBase from '$lib/components/CardBase.svelte';
	import CardProject from '$lib/components/CardProject.svelte';
	import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';

	// Types, Enums
	import type { ConfirmPopupInfo } from '$lib/types/ConfirmPopupInfo';
	import { TypeProject } from '$lib/enums/TypeProject.enum';

	let awaitLoad = [1, 2, 3, 4];
	let projects: any = [];
	let showNewProject = false;
	const confirmPopupInfo: ConfirmPopupInfo = {
		show: false,
		question: '',
		description: undefined,
		type: ''
	};

	fetch('/api/dashboard')
		.then((response) => response.json())
		.then((data) => (projects = data));

	function handleNewProject(type: TypeProject) {
		alert('Creando proyecto ' + type);
	}

	function handleDelete(event: any) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea eliminar el ';
		confirmPopupInfo.type = 'delete';
		confirmPopupInfo.detail = event.detail.id;

		if (TypeProject.BUDGET === event.detail.type) {
			confirmPopupInfo.question += 'presupuesto?';
			confirmPopupInfo.description =
				'Se eliminará toda la información asociada y no será posible recuperarla';
		}
	}

	function handleClone(event: any) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea duplicar el ';
		confirmPopupInfo.type = 'clone';
		confirmPopupInfo.detail = event.detail.id;

		if (TypeProject.BUDGET === event.detail.type) {
			confirmPopupInfo.question += 'presupuesto?';
			confirmPopupInfo.description =
				'Se duplicará la información principal. Las transacciones no serán duplicadas';
		}
	}

	function handlePopUpAccept() {
		alert(confirmPopupInfo.type + ': ' + confirmPopupInfo.detail);
		resetConfirmPopupInfo();
	}

	function handlePopUpCancel() {
		resetConfirmPopupInfo();
	}

	function resetConfirmPopupInfo() {
		confirmPopupInfo.show = false;
		confirmPopupInfo.question = '';
		confirmPopupInfo.description = undefined;
		confirmPopupInfo.type = '';
		confirmPopupInfo.detail = undefined;
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section
	class="container mx-auto justify-center grid grid-cols-[repeat(auto-fit,_minmax(276px,_300px))] gap-[22px] p-[22px]"
>
	{#if projects && projects.length > 0}
		<CardBase>
			<section
				class="flex justify-center items-center gap-2 text-gray-400 font-bold w-full h-full select-none cursor-pointer"
				on:click={() => (showNewProject = !showNewProject)}
			>
				<i class="fa-solid fa-plus text-6xl" />
				<span class="text-3xl text-center w-min">Crear Proyecto</span>
			</section>

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

		{#each projects as project}
			<CardProject
				{...project}
				on:edit={() => alert('Not implemented')}
				on:delete={handleDelete}
				on:clone={handleClone}
			/>
		{/each}
	{:else}
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
							<div class="z-10 block w-[30px] h-[30px] rounded-full bg-slate-400" />
							<div class="z-10 block w-[30px] h-[30px] rounded-full bg-slate-400" />
						</div>
					</div>
				</div>
			</CardBase>
		{/each}
	{/if}
</section>

{#if confirmPopupInfo.show}
	<ConfirmPopup {...confirmPopupInfo} on:accept={handlePopUpAccept} on:cancel={handlePopUpCancel} />
{/if}
