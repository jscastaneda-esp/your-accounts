<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation';

	// Felte
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import { validator } from '@felte/validator-yup';

	// Assets
	import logo from '../assets/images/logo.png';
	import logoGoogle from '../assets/images/logo-google.png';
	import forgotPassword from '../assets/images/forgot-password.png';

	// Enums, Classes, Types
	import { FirebaseProviderEnum } from '../enums/firebaseProvider.enum';
	import type { FirebaseError } from 'firebase/app';

	// Components
	import ButtonExternalAuth from './ButtonExternalAuth.svelte';
	import Input from './Input.svelte';
	import PasswordInput from './PasswordInput.svelte';
	import Button from './Button.svelte';
	import ButtonLink from './ButtonLink.svelte';
	import ButtonLoading from './ButtonLoading.svelte';

	// Utilities
	import firebase from '../configs/firebase.client';
	import Toast from '../utils/toast';

	// Form Definition
	yup.setLocale({
		mixed: {
			required: 'Campo requerido'
		},
		string: {
			email: 'Email invalido',
			min: ({ min }) => `Minimo ${min} caracteres`
		}
	});
	const validationSchema = yup.object().shape({
		email: yup.string().email().required(),
		password: yup.string().min(2).required()
	});
	const { form, errors, isValid, isSubmitting } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: (values) =>
			firebase.authFunctions.signInWithEmailAndPassword(values.email, values.password),
		onSuccess: () => goto('/dashboard'),
		onError: (error: unknown) => {
			Toast.clear();
			Toast.warn(firebase.authFunctions.getError((error as FirebaseError).code));
		},
		extend: [validator({ schema: validationSchema })]
	});

	let loading = false;

	async function signInGoogle() {
		loading = true;
		try {
			await firebase.authFunctions.signInWithPopup(FirebaseProviderEnum.GOOGLE);
			goto('/dashboard');
		} catch (error: unknown) {
			Toast.clear();
			Toast.warn(
				firebase.authFunctions.getError((error as FirebaseError).code, {
					PROVIDER: FirebaseProviderEnum.GOOGLE
				})
			);
		} finally {
			loading = false;
		}
	}
</script>

<form
	class="bg-blue-400 w-full h-full min-h-screen flex flex-col justify-center items-center px-10 py-4 bg-image-auth"
	use:form
>
	<section class="flex justify-center items-center gap-2 mb-[10px] w-full">
		<img src={logo} alt="Logo" class="w-12 h-12" />
		<span class="text-center text-white text-xl leading-6">Ingresar a Tus Cuentas</span>
	</section>

	<section class="flex flex-col gap-3 w-full mb-[10px]">
		<ButtonExternalAuth value="Google" on:click={signInGoogle} disabled={$isSubmitting || loading}>
			<img src={logoGoogle} alt="Logo Google" />
		</ButtonExternalAuth>

		<hr class="bg-[#dddddd]" />

		<Input
			id="email"
			name="email"
			placeholder="Correo electrónico"
			type="email"
			errors={$errors.email}
		/>
		<PasswordInput
			id="password"
			name="password"
			placeholder="Contraseña"
			errors={$errors.password}
		/>

		{#if $isSubmitting || loading}
			<ButtonLoading />
		{:else}
			<Button type="submit" value="Iniciar Sesión" disabled={!$isValid} />
		{/if}
	</section>

	<section class="flex flex-col gap-2 w-full items-center">
		<ButtonLink text="Recuperar contraseña" href="#">
			<img src={forgotPassword} alt="Forgot Password" />
		</ButtonLink>
		<ButtonLink text="Registrarse" href="#">
			<i class="fa-solid fa-right-to-bracket text-black" />
		</ButtonLink>
	</section>
</form>
