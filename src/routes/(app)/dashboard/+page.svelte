<script lang="ts">
	// Utilities
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Toast from '$lib/utils/toast.utils';
	import { session } from '$lib/stores';
	import { trpc } from '$lib/trpc/client';

	// Components
	import CardBase from '$lib/components/cards/CardBase.svelte';
	import CardProject from '$lib/components/cards/CardProject.svelte';
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';
	import PopupConfirm from '$lib/components/popups/PopupConfirm.svelte';

	// Types, Enums
	import { TypeProjectEnum } from '$lib/enums';
	import type { EventDispatchProject, Project } from '$lib/types';
	import ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo';

	const awaitLoad = [1, 2, 3];
	let confirmPopupInfo = new ConfirmPopupInfo();
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo = confirmPopupInfo.reset();
	};
	const trpcF = trpc();
	let loading = false;
	let projects: Project[];
	let showNewProject = false;

	onMount(() => {
		getProjects();
	});

	async function getProjects() {
		if ($session && $session.uid) {
			try {
				projects = await trpcF.projects.getByUserId.query($session.uid);
			} catch (error) {
				Toast.error('Se presento un error al consultar los proyectos', true);
				throw error;
			}
		}
	}

	async function handleNewProject(type: TypeProjectEnum) {
		if ($session && $session.uid) {
			loading = true;

			let url = '';
			if (TypeProjectEnum.BUDGET === type) {
				url = '/budget';
			}

			try {
				const newProject = await trpcF.projects.create.mutate({
					userId: $session.uid,
					type
				});
				await goto(`${url}/${newProject.id}`);
			} catch (error) {
				Toast.error('Se presento un error al crear el proyecto', true);
				throw error;
			} finally {
				loading = false;
			}
		}
	}

	async function handleDeleteProject({ detail }: { detail: EventDispatchProject }) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea eliminar el ';

		if (TypeProjectEnum.BUDGET === detail.type) {
			confirmPopupInfo.question += `presupuesto ${detail.name}?`;
			confirmPopupInfo.description =
				'Se eliminará toda la información asociada y no será posible recuperarla';
		}

		confirmPopupInfo.actionOk = async () => {
			loading = true;

			try {
				await trpcF.projects.delete.mutate(detail.id);
				Toast.success('Se elimino exitosamente el proyecto', true);
				projects = projects.filter((project) => project.id != detail.id);
			} catch (error) {
				Toast.error('Se presento un error al eliminar el proyecto', true);
				throw error;
			} finally {
				loading = false;
			}
		};
	}

	async function handleCloneProject({ detail }: { detail: EventDispatchProject }) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea duplicar el ';

		if (TypeProjectEnum.BUDGET === detail.type) {
			confirmPopupInfo.question += `presupuesto ${detail.name}?`;
			confirmPopupInfo.description =
				'Se duplicará la información principal. Las transacciones no serán duplicadas';
		}

		confirmPopupInfo.actionOk = async () => {
			if ($session && $session.uid) {
				loading = true;

				let url = '';
				if (TypeProjectEnum.BUDGET === detail.type) {
					url = '/budget';
				}

				try {
					const newProject = await trpcF.projects.create.mutate({
						userId: $session.uid,
						type: detail.type,
						baseId: detail.id
					});
					await goto(`${url}/${newProject.id}`);
				} catch (error) {
					Toast.error('Se presento un error al duplicar el proyecto', true);
					throw error;
				} finally {
					loading = false;
				}
			}
		};
	}
</script>

<svelte:head>
	<title>Dashboard | Tus Cuentas</title>
</svelte:head>

<section
	class="grid grid-cols-[repeat(auto-fit,_300px)] place-content-start_evenly gap-y-[22px] p-[22px] m-auto container"
>
	{#if projects}
		<CardBase>
			<button
				type="button"
				class="flex justify-center items-center gap-2 text-gray-500 font-bold w-full h-full select-none cursor-pointer"
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
						class="block rounded-lg py-[6px] TypeProjectEnumm text-gray-500 hover:bg-gray-100 hover:text-gray-700 no-underline"
						role="menuitem"
						on:click={() => handleNewProject(TypeProjectEnum.BUDGET)}
						href={'#'}
					>
						<i class="fa-solid fa-cash-register" />
						<span class="ml-2 tracking-wider font-semibold">Presupuesto</span>
					</a>
				</div>
			</div>
		</CardBase>

		{#each projects as project (project.id)}
			<CardProject
				bind:loading
				{...project}
				on:delete={handleDeleteProject}
				on:clone={handleCloneProject}
			/>
		{/each}
		<div />
		<div />
		<div />
	{:else}
		<CardBase>
			<div class="animate-pulse">
				<div class="bg-slate-400 w-full h-[140px]" />
			</div>
		</CardBase>
		{#each awaitLoad as _}
			<CardBase>
				<div class="animate-pulse h-full flex flex-col justify-between">
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
	{/if}
</section>

{#if loading}
	<ScreenLoading />
{/if}

<PopupConfirm data={confirmPopupInfo} />
