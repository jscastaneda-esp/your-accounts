<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation';

	// Felte
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';

	// Assets
	import logo from '../assets/images/logo.png';
	import logoGoogle from '../assets/images/logo-google.png';
	import forgotPassword from '../assets/images/forgot-password-icon.png';

	// Enums, Classes, Types
	import { FirebaseProviderEnum } from '../enums/FirebaseProvider.enum';
	import type { FirebaseError } from 'firebase/app';
	import { TypeAuthEnum } from '../enums/TypeAuth.enum';

	// Components
	import ButtonExternalAuth from './ButtonExternalAuth.svelte';
	import Input from './Input.svelte';
	import PasswordInput from './PasswordInput.svelte';
	import Button from './Button.svelte';
	import ButtonLink from './ButtonLink.svelte';

	// Utilities
	import firebase from '../configs/firebase.client';
	import Toast from '../utils/toast.utils';
	import yup, { email, password } from '../utils/yup.utils';

	// Form Definition
	const validationSchema = yup.object().shape({
		email,
		password
	});
	const { form, errors, isValid, isSubmitting, reset } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: (values) => {
			Toast.clear();
			firebase.authFunctions.signInWithEmailAndPassword(values.email, values.password);
		},
		onSuccess: () => goto('/dashboard'),
		onError: (error: unknown) => {
			const [msg, isError] = firebase.authFunctions.getError(
				TypeAuthEnum.LOGIN,
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

	let loading = false;

	async function signInGoogle() {
		Toast.clear();
		loading = true;

		try {
			await firebase.authFunctions.signInWithPopup(FirebaseProviderEnum.GOOGLE);
			goto('/dashboard');
		} catch (error: unknown) {
			const [msg, isError] = firebase.authFunctions.getError(
				TypeAuthEnum.LOGIN,
				(error as FirebaseError).code,
				{
					PROVIDER: FirebaseProviderEnum.GOOGLE
				}
			);
			if (isError) {
				Toast.error(msg);
			} else {
				Toast.warn(msg);
			}
		} finally {
			loading = false;
		}
	}

	$: loadingEvent = $isSubmitting || loading;
</script>

<form class="flex flex-col justify-center items-center min-w-[238px] max-w-[238px]" use:form>
	<section class="flex justify-center items-center gap-2 mb-[10px] w-full">
		<img src={logo} alt="Logo" class="w-12 h-12" />
		<span class="text-center text-white text-xl leading-6">Ingresar a Tus Cuentas</span>
	</section>

	<section class="flex flex-col gap-3 w-full mb-[10px]">
		<ButtonExternalAuth value="Google" on:click={signInGoogle} loading={loadingEvent}>
			<img src={logoGoogle} alt="Logo Google" />
		</ButtonExternalAuth>

		<hr class="bg-[#dddddd]" />

		<Input
			id="email"
			name="email"
			placeholder="Correo electrónico"
			disabled={loadingEvent}
			type="email"
			errors={$errors.email}
		/>
		<PasswordInput
			id="password"
			name="password"
			placeholder="Contraseña"
			disabled={loadingEvent}
			errors={$errors.password}
		/>

		<Button type="submit" value="Iniciar Sesión" disabled={!$isValid} loading={loadingEvent} />
	</section>

	<section class="flex flex-col gap-2 w-full items-center">
		<ButtonLink
			text="Recuperar contraseña"
			href="/auth/forgot-password"
			disabled={loadingEvent}
			className="bg-blue-400"
		>
			<img src={forgotPassword} alt="Forgot Password" />
		</ButtonLink>
		<ButtonLink
			text="Registrarse"
			href="/auth/signup"
			disabled={loadingEvent}
			className="bg-blue-400"
			on:click={reset}
		>
			<i class="fa-solid fa-angles-right text-black" />
		</ButtonLink>
	</section>
</form>
