import type { UserCredential } from 'firebase/auth'
import firebaseService from './firebase.service'
import type { FirebaseError } from 'firebase/app'
import { FirebaseProviderEnum } from '$lib/enums'

class LoginService {
	async signIn(
		auth: () => Promise<UserCredential>,
		successCB: () => Promise<void> | void,
		errCb: (msg: string, isError: boolean) => void,
		tagsError?: Record<string, string>
	) {
		try {
			const userCredential = await auth()
			if (userCredential.user.email) {
				const response = await fetch('/login', {
					method: 'POST',
					body: JSON.stringify({
						uuid: userCredential.user.uid,
						email: userCredential.user.email
					})
				})
				if (response.status != 200) {
					firebaseService.authFunctions.signOut()
					throw new Error('Error inesperado. Por favor vuelva a intentarlo')
				}
			}

			await successCB()
		} catch (error) {
			let msg: string
			let isError = true

			if ((error as FirebaseError).code) {
				;[msg, isError] = firebaseService.authFunctions.getError(
					(error as FirebaseError).code,
					tagsError
				)
			} else {
				msg = (error as Error).message
			}
			errCb(msg, isError)
		}
	}

	signInGoogle(
		successCB: () => Promise<void> | void,
		errCb: (msg: string, isError: boolean) => void
	) {
		return this.signIn(
			() => firebaseService.authFunctions.signInWithPopup(FirebaseProviderEnum.GOOGLE),
			successCB,
			errCb,
			{
				PROVIDER: FirebaseProviderEnum.GOOGLE
			}
		)
	}

	signInTest(
		successCB: () => Promise<void> | void,
		errCb: (msg: string, isError: boolean) => void
	) {
		return this.signIn(
			() =>
				firebaseService.authFunctions.signInWithEmailAndPassword(
					'test@jsc-developer.com',
					'12345678'
				),
			successCB,
			errCb
		)
	}
}

export default LoginService
