<script lang="ts">
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Felte
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';

	// Assets
	import updtePassword from '$lib/assets/images/update-password.png';

	// Enums, Classes, Types
	import type { FirebaseError } from 'firebase/app';
	import { TypeAuthEnum } from '$lib/enums/TypeAuth.enum';

	// Components
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Button from '$lib/components/Button.svelte';

	// Utilities
	import firebase from '$lib/configs/firebase.client';
	import Toast from '$lib/utils/toast.utils';
	import yup, { password } from '$lib/utils/yup.utils';
	import type { PageDataUserManagementAction } from '$lib/types/PageDataUserManagementAction';

	export let data: PageDataUserManagementAction;

	onMount(async () => {
		try {
			await firebase.authFunctions.verifyPasswordResetCode(data.actionCode);
		} catch (error: unknown) {
			Toast.clear();

			const msg = firebase.authFunctions.getError(
				TypeAuthEnum.FORGOT_PASSWORD,
				(error as FirebaseError).code
			)[0];

			alert(msg);
			goto('/auth/login');
		}
	});

	// Form Definition
	const validationSchema = yup.object().shape({
		password,
		confirmPassword: password.test('equals', 'Contraseña no coincide', (value, context) => {
			if (context.parent.password && value) {
				return context.parent.password === value;
			}

			return true;
		})
	});
	const { form, errors, isValid, isSubmitting } = createForm({
		initialValues: {
			password: '',
			confirmPassword: ''
		},
		onSubmit: (values) => {
			firebase.authFunctions.confirmPasswordReset(data.actionCode, values.password);
		},
		onSuccess: () => {
			Toast.clear();
			Toast.success('Se asigno la contraseña exitosamente');

			setTimeout(() => {
				Toast.clear();
				goto('/auth/login');
			}, 2000);
		},
		onError: (error: unknown) => {
			Toast.clear();

			const [msg, isError] = firebase.authFunctions.getError(
				TypeAuthEnum.FORGOT_PASSWORD,
				(error as FirebaseError).code
			);
			if (isError) {
				Toast.error(msg);
			} else {
				Toast.warn(msg);
			}
		},
		extend: [validator({ schema: validationSchema })]
	});
</script>

<svelte:head>
	<title>Asignar Nueva Contraseña</title>
</svelte:head>

<div class="flex justify-center items-center">
	<div
		class="bg-white bg-image-auth flex justify-center w-full min-w-[320px] lg:w-[568px] h-full min-h-screen lg:h-[603px] lg:min-h-full shadow-md shadow-gray-500"
	>
		<form class="flex flex-col justify-center items-center min-w-[238px] max-w-[238px]" use:form>
			<section class="flex justify-center items-center gap-2 mb-[10px] w-full">
				<img src={updtePassword} alt="Logo" class="w-12 h-12" />
				<span class="text-center text-black text-xl leading-6">Asignar nueva contraseña</span>
			</section>

			<section class="flex flex-col gap-3 w-full mb-[10px]">
				<PasswordInput
					id="password"
					name="password"
					placeholder="Nueva contraseña"
					disabled={$isSubmitting}
					errors={$errors.password}
				/>
				<PasswordInput
					id="confirmPassword"
					name="confirmPassword"
					placeholder="Confirmar nueva contraseña"
					disabled={$isSubmitting}
					errors={$errors.confirmPassword}
				/>

				<Button
					type="submit"
					value="Asignar contraseña"
					disabled={!$isValid}
					loading={$isSubmitting}
				/>
			</section>
		</form>
	</div>
</div>
