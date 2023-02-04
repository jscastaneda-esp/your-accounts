import { browser } from '$app/environment';
import { PUBLIC_FIREBASE_OPTIONS } from '$env/static/public';
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged as onAuthStateChangedFB,
	createUserWithEmailAndPassword as createUserWithEmailAndPasswordFB,
	sendPasswordResetEmail as sendPasswordResetEmailFB,
	signInWithEmailAndPassword as signInWithEmailAndPasswordFB,
	signInWithPopup as signInWithPopupFB,
	signOut as signOutFB,
	updateProfile as updateProfileFB,
	verifyPasswordResetCode as verifyPasswordResetCodeFB,
	confirmPasswordReset as confirmPasswordResetFB,
	GoogleAuthProvider,
	type NextOrObserver,
	type ErrorFn,
	type CompleteFn,
	type User,
	type Auth,
	type ActionCodeSettings,
	type PopupRedirectResolver,
	AuthErrorCodes
} from 'firebase/auth';
import { FirebaseProviderEnum, TypeAuthEnum } from '../enums';

class FirebaseAuth {
	private readonly ERROR_MESSAGES: Record<string, Record<string, [string, boolean]>> = {
		[TypeAuthEnum.FORGOT_PASSWORD]: {
			[AuthErrorCodes.USER_DELETED]: ['Correo electrónico no existe', false],
			[AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: [
				'Excedió el número de intentos para recuperar contraseña. Por favor intente más tarde',
				false
			],
			[AuthErrorCodes.EXPIRED_OOB_CODE]: ['La URL es invalida o ya expiro', true],
			[AuthErrorCodes.INVALID_OOB_CODE]: ['La URL es invalida o ya expiro', true]
		},
		other: {
			[AuthErrorCodes.EXPIRED_POPUP_REQUEST]: [
				'Se presento un error al autenticar con {PROVIDER}',
				true
			],
			[AuthErrorCodes.POPUP_BLOCKED]: ['Se presento un error al autenticar con {PROVIDER}', true],
			[AuthErrorCodes.POPUP_CLOSED_BY_USER]: [
				'Se presento un error al autenticar con {PROVIDER}',
				true
			],
			[AuthErrorCodes.USER_DELETED]: ['Correo electrónico y/o contraseña inválidos', false],
			[AuthErrorCodes.INVALID_PASSWORD]: ['Correo electrónico y/o contraseña inválidos', false],
			[AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE]: [
				'Correo electrónico ya se encuentra registrado',
				false
			],
			[AuthErrorCodes.EMAIL_EXISTS]: ['Correo electrónico ya se encuentra registrado', false]
		}
	};

	private readonly _googleAuthProvider: GoogleAuthProvider;

	constructor(private readonly _auth: Auth) {
		this._googleAuthProvider = new GoogleAuthProvider();
	}

	onAuthStateChanged(
		nextOrObserver: NextOrObserver<User>,
		error?: ErrorFn | undefined,
		completed?: CompleteFn | undefined
	) {
		return onAuthStateChangedFB(this._auth, nextOrObserver, error, completed);
	}

	createUserWithEmailAndPassword(email: string, password: string) {
		return createUserWithEmailAndPasswordFB(this._auth, email, password);
	}

	signInWithEmailAndPassword(email: string, password: string) {
		return signInWithEmailAndPasswordFB(this._auth, email, password);
	}

	signInWithPopup(provider: FirebaseProviderEnum, resolver?: PopupRedirectResolver | undefined) {
		if (FirebaseProviderEnum.GOOGLE === provider) {
			return signInWithPopupFB(this._auth, this._googleAuthProvider, resolver);
		}

		throw new Error('Provider no implemented');
	}

	signOut() {
		return signOutFB(this._auth);
	}

	updateProfile(displayName: string, user: User | null = this._auth.currentUser) {
		if (user) {
			return updateProfileFB(user, { displayName });
		}
	}

	sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings | undefined) {
		return sendPasswordResetEmailFB(this._auth, email, actionCodeSettings);
	}

	verifyPasswordResetCode(code: string) {
		return verifyPasswordResetCodeFB(this._auth, code);
	}

	confirmPasswordReset(oobCode: string, newPassword: string) {
		return confirmPasswordResetFB(this._auth, oobCode, newPassword);
	}

	getError(
		type: TypeAuthEnum,
		code: string | null | undefined,
		tags?: Record<string, string>
	): [string, boolean] {
		let msg: string | null = null;
		let isError = true;
		if (type && code) {
			const messagesType = this.ERROR_MESSAGES[type];
			let messageCode: [string, boolean] | null | undefined = null;
			if (messagesType) {
				messageCode = messagesType[code];
			}

			if (!messageCode) {
				messageCode = this.ERROR_MESSAGES.other[code];
			}

			if (messageCode) {
				msg = messageCode[0];
				isError = messageCode[1];
			}

			if (msg && tags) {
				msg = Object.keys(tags).reduce(
					(previous, current) => previous.replace(`{${current}}`, tags[current]),
					msg
				);
			}
		}

		if (!msg) {
			msg = 'Error inesperado. Por favor vuelva a intentarlo';
			isError = true;
		}

		return [msg, isError];
	}
}

class Firebase {
	private readonly _app: FirebaseApp;
	private readonly _auth: Auth;
	private readonly _authFunctions: FirebaseAuth;

	constructor() {
		let firebaseOptionsJson: string;
		if (browser) {
			firebaseOptionsJson = window.atob(PUBLIC_FIREBASE_OPTIONS);
		} else {
			firebaseOptionsJson = Buffer.from(PUBLIC_FIREBASE_OPTIONS, 'base64').toString('ascii');
		}

		const firebaseOptions: FirebaseOptions = JSON.parse(firebaseOptionsJson);
		this._app = initializeApp(firebaseOptions);
		this._auth = getAuth(this._app);
		this._authFunctions = new FirebaseAuth(this._auth);
	}

	get app() {
		return this._app;
	}

	get auth() {
		return this._auth;
	}

	get authFunctions() {
		return this._authFunctions;
	}
}

// Initialize Firebase
export default new Firebase();
