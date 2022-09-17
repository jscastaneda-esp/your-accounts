import { TypeAuthEnum } from '$lib/enums/typeAuth.enum';
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
import { FirebaseProviderEnum } from '../enums/firebaseProvider.enum';

// FIXME Dejar por variable de entorno
const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyApkPBNW6koMFOMcK8lSVABgHFXbDvaQEA',
	authDomain: 'your-accounts-dev-9b1ae.firebaseapp.com',
	projectId: 'your-accounts-dev-9b1ae',
	storageBucket: 'your-accounts-dev-9b1ae.appspot.com',
	messagingSenderId: '1017011775128',
	appId: '1:1017011775128:web:1d21c6ab8c6cb53bd492ed'
};

class FirebaseAuth {
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

	getError(
		type: TypeAuthEnum,
		code: string | null | undefined,
		tags?: { [key: string]: string }
	): [string, boolean] {
		/*
    EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request"
    POPUP_BLOCKED: "auth/popup-blocked"
    POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user"
    USER_DELETED: "auth/user-not-found"
    INVALID_PASSWORD: "auth/wrong-password"
		CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use"
    EMAIL_EXISTS: "auth/email-already-in-use"
		*/
		console.log(code);

		let msg = 'Error inesperado. Por favor vuelva a intentarlo';
		let isError = true;
		if (TypeAuthEnum.FORGOT_PASSWORD === type) {
			if (AuthErrorCodes.USER_DELETED === code) {
				msg = 'Correo electrónico no existe';
				isError = false;
			} else if (AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER === code) {
				msg =
					'Excedió el número de intentos para recuperar contraseña. Por favor intente más tarde';
				isError = false;
			}
		} else {
			if (
				AuthErrorCodes.EXPIRED_POPUP_REQUEST === code ||
				AuthErrorCodes.POPUP_BLOCKED === code ||
				AuthErrorCodes.POPUP_CLOSED_BY_USER === code
			) {
				msg = 'Se presento un error al autenticar con {PROVIDER}';
			} else if (AuthErrorCodes.USER_DELETED === code || AuthErrorCodes.INVALID_PASSWORD === code) {
				msg = 'Correo electrónico y/o contraseña inválidos';
				isError = false;
			} else if (
				AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE === code ||
				AuthErrorCodes.EMAIL_EXISTS === code
			) {
				msg = 'Correo electrónico ya se encuentra registrado';
				isError = false;
			}
		}

		if (tags) {
			Object.keys(tags).forEach((key) => {
				msg = msg.replace(`{${key}}`, tags[key]);
			});
		}
		return [msg, isError];
	}
}

class Firebase {
	private readonly _app: FirebaseApp;
	private readonly _auth: Auth;
	private readonly _authFunctions: FirebaseAuth;

	constructor() {
		this._app = initializeApp(firebaseConfig);
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
