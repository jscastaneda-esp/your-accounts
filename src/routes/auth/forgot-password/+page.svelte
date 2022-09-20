<script lang="ts">
	// Felte
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';

	// Assets
	import forgotPassword from '$lib/assets/images/forgot-password.png';

	// Enums, Classes, Types
	import type { FirebaseError } from 'firebase/app';
	import { TypeAuthEnum } from '$lib/enums/TypeAuth.enum';

	// Components
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';

	// Utilities
	import firebase from '$lib/configs/firebase.client';
	import Toast from '$lib/utils/toast.utils';
	import yup, { email } from '$lib/utils/yup.utils';

	// Form Definition
	const validationSchema = yup.object().shape({
		email
	});
	const { form, errors, isValid, isSubmitting } = createForm({
		initialValues: {
			email: ''
		},
		onSubmit: (values) => firebase.authFunctions.sendPasswordResetEmail(values.email),
		onSuccess: () => {
			Toast.clear();
			Toast.success(
				'Se ha enviado un correo electrónico a su cuenta de correo. Por favor siga los pasos indicados'
			);
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
	<title>Recuperar Contraseña</title>
</svelte:head>

<div class="flex justify-center items-center">
	<div
		class="bg-white bg-image-auth flex justify-center w-full min-w-[320px] lg:w-[568px] h-full min-h-screen lg:h-[603px] lg:min-h-full shadow-md shadow-gray-500"
	>
		<form class="flex flex-col justify-center items-center min-w-[238px] max-w-[238px]" use:form>
			<section class="flex justify-center items-center gap-2 mb-[10px] w-full">
				<img src={forgotPassword} alt="Logo" class="w-12 h-12" />
				<span class="text-center text-black text-xl leading-6">Recupera tu contraseña</span>
			</section>

			<section class="flex flex-col gap-3 w-full mb-[10px]">
				<Input
					id="email"
					name="email"
					placeholder="Correo electrónico"
					disabled={$isSubmitting}
					type="email"
					errors={$errors.email}
				/>

				<Button
					type="submit"
					value="Recuperar contraseña"
					disabled={!$isValid}
					loading={$isSubmitting}
				/>
			</section>

			<section class="flex flex-col gap-2 w-full items-center">
				<ButtonLink
					text="Iniciar Sesión"
					href="/auth/login"
					disabled={$isSubmitting}
					className="bg-white"
				>
					<i class="fa-solid fa-angles-left text-black" />
				</ButtonLink>
			</section>
		</form>
	</div>
</div>
