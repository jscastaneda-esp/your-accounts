<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation';

	// Felte
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';

	// Assets
	import logo from '../assets/images/logo.png';

	// Enums, Classes, Types
	import type { FirebaseError } from 'firebase/app';
	import type { UserCredential } from 'firebase/auth';
	import { TypeAuthEnum } from '../enums/TypeAuth.enum';

	// Components
	import Input from './Input.svelte';
	import PasswordInput from './PasswordInput.svelte';
	import Button from './Button.svelte';
	import ButtonLink from './ButtonLink.svelte';

	// Utilities
	import firebase from '../configs/firebase.client';
	import Toast from '../utils/toast.utils';
	import yup, { defaultText, email, password } from '../utils/yup.utils';

	// Form Definition
	const validationSchema = yup.object().shape({
		fullName: defaultText.max(100),
		email,
		password,
		confirmPassword: password.test('equals', 'Contraseña no coincide', (value, context) => {
			if (context.parent.password && value) {
				return context.parent.password === value;
			}

			return true;
		})
	});
	const { form, data, errors, isValid, isSubmitting, reset } = createForm({
		initialValues: {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		onSubmit: (values) => {
			Toast.clear();
			firebase.authFunctions.createUserWithEmailAndPassword(values.email, values.password);
		},
		onSuccess: async (response: unknown) => {
			await firebase.authFunctions.updateProfile($data.fullName, (response as UserCredential).user);
			await firebase.authFunctions.signInWithEmailAndPassword($data.email, $data.password);
			goto('/dashboard');
		},
		onError: (error: unknown) => {
			const [msg, isError] = firebase.authFunctions.getError(
				TypeAuthEnum.SIGNUP,
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

<form class="flex flex-col justify-center items-center min-w-[238px] max-w-[238px]" use:form>
	<section class="flex justify-center items-center gap-2 mb-[10px] w-full">
		<img src={logo} alt="Logo" class="w-12 h-12" />
		<span class="text-center text-black text-xl leading-6">Registrate para Tus Cuentas</span>
	</section>

	<section class="flex flex-col gap-3 w-full mb-[10px]">
		<Input
			id="fullName"
			name="fullName"
			placeholder="Nombre completo"
			disabled={$isSubmitting}
			errors={$errors.fullName}
		/>
		<Input
			id="email"
			name="email"
			placeholder="Correo electrónico"
			disabled={$isSubmitting}
			type="email"
			errors={$errors.email}
		/>
		<PasswordInput
			id="password"
			name="password"
			placeholder="Contraseña"
			disabled={$isSubmitting}
			errors={$errors.password}
		/>
		<PasswordInput
			id="confirmPassword"
			name="confirmPassword"
			placeholder="Confirmar contraseña"
			disabled={$isSubmitting}
			errors={$errors.confirmPassword}
		/>

		<Button type="submit" value="Registrarse" disabled={!$isValid} loading={$isSubmitting} />
	</section>

	<section class="flex flex-col gap-2 w-full items-center">
		<ButtonLink
			text="Iniciar Sesión"
			href="/auth/login"
			disabled={$isSubmitting}
			className="bg-white"
			on:click={reset}
		>
			<i class="fa-solid fa-angles-left text-black" />
		</ButtonLink>
	</section>
</form>
