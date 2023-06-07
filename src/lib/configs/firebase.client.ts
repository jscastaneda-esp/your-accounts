import { browser } from '$app/environment'
import { PUBLIC_FIREBASE_OPTIONS } from '$env/static/public'
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
	getAuth,
	onAuthStateChanged as onAuthStateChangedFire,
	signInWithPopup as signInWithPopupFire,
	signInWithEmailAndPassword as signInWithEmailAndPasswordFire,
	signOut as signOutFire,
	GoogleAuthProvider,
	type NextOrObserver,
	type ErrorFn,
	type CompleteFn,
	type User,
	type Auth,
	type PopupRedirectResolver,
	AuthErrorCodes
} from 'firebase/auth'
import { FirebaseProviderEnum } from '../enums'

class FirebaseAuth {
	private readonly ERROR_MESSAGES: Record<string, [string, boolean]> = {
		[AuthErrorCodes.EXPIRED_POPUP_REQUEST]: [
			'Se presento un error al autenticar con {PROVIDER}',
			true
		],
		[AuthErrorCodes.POPUP_BLOCKED]: ['Se presento un error al autenticar con {PROVIDER}', true],
		[AuthErrorCodes.POPUP_CLOSED_BY_USER]: [
			'Se presento un error al autenticar con {PROVIDER}',
			true
		]
	}

	private readonly _googleAuthProvider: GoogleAuthProvider

	constructor(private readonly _auth: Auth) {
		this._googleAuthProvider = new GoogleAuthProvider()
	}

	onAuthStateChanged(
		nextOrObserver: NextOrObserver<User>,
		error?: ErrorFn | undefined,
		completed?: CompleteFn | undefined
	) {
		return onAuthStateChangedFire(this._auth, nextOrObserver, error, completed)
	}

	signInWithPopup(provider: FirebaseProviderEnum, resolver?: PopupRedirectResolver | undefined) {
		if (FirebaseProviderEnum.GOOGLE === provider) {
			return signInWithPopupFire(this._auth, this._googleAuthProvider, resolver)
		}

		throw new Error('Provider no implemented')
	}

	signInWithEmailAndPassword(email: string, password: string) {
		return signInWithEmailAndPasswordFire(this._auth, email, password)
	}

	signOut() {
		return signOutFire(this._auth)
	}

	getError(code: string | null | undefined, tags?: Record<string, string>): [string, boolean] {
		let msg: string | null = null
		let isError = true
		if (code) {
			const messageCode = this.ERROR_MESSAGES[code]
			if (messageCode) {
				msg = messageCode[0]
				isError = messageCode[1]
			}

			if (msg && tags) {
				msg = Object.keys(tags).reduce(
					(previous, current) => previous.replace(`{${current}}`, tags[current]),
					msg
				)
			}
		}

		if (!msg) {
			msg = 'Error inesperado. Por favor vuelva a intentarlo'
			isError = true
		}

		return [msg, isError]
	}
}

class Firebase {
	private readonly _app: FirebaseApp
	private readonly _auth: Auth
	private readonly _authFunctions: FirebaseAuth

	constructor() {
		let firebaseOptionsJson: string
		if (browser) {
			firebaseOptionsJson = window.atob(PUBLIC_FIREBASE_OPTIONS)
		} else {
			firebaseOptionsJson = Buffer.from(PUBLIC_FIREBASE_OPTIONS, 'base64').toString('ascii')
		}

		const firebaseOptions: FirebaseOptions = JSON.parse(firebaseOptionsJson)
		this._app = initializeApp(firebaseOptions)
		this._auth = getAuth(this._app)
		this._authFunctions = new FirebaseAuth(this._auth)
	}

	get app() {
		return this._app
	}

	get auth() {
		return this._auth
	}

	get authFunctions() {
		return this._authFunctions
	}
}

// Initialize Firebase
export default new Firebase()
