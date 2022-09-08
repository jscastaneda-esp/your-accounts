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
	type PopupRedirectResolver
} from 'firebase/auth';

// FIXME Dejar por variable de entorno
const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyApkPBNW6koMFOMcK8lSVABgHFXbDvaQEA',
	authDomain: 'your-accounts-dev-9b1ae.firebaseapp.com',
	projectId: 'your-accounts-dev-9b1ae',
	storageBucket: 'your-accounts-dev-9b1ae.appspot.com',
	messagingSenderId: '1017011775128',
	appId: '1:1017011775128:web:1d21c6ab8c6cb53bd492ed'
};

enum FirebaseProvider {
	GOOGLE = 'google',
	FACEBOOK = 'facebook'
}

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

	signInWithPopup(provider: FirebaseProvider, resolver?: PopupRedirectResolver | undefined) {
		if (FirebaseProvider.GOOGLE === provider) {
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
export const firebase = new Firebase();
