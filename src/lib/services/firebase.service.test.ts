import { describe, expect, it, afterEach, vi } from 'vitest'
import { AuthErrorCodes } from 'firebase/auth'
import firebaseService from './firebase.service'
import { FirebaseProviderEnum } from '$lib/enums'

vi.mock('$env/static/public', () => ({
	PUBLIC_FIREBASE_OPTIONS: Buffer.from('{"apiKey": "test"}').toString('base64')
}))

vi.mock('$app/environment', () => ({
	browser: false
}))

vi.mock('firebase/app', () => ({
	initializeApp: vi.fn(() => ({
		name: 'Test'
	}))
}))

vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(() => ({
		currentUser: {
			displayName: 'Test',
			email: 'test@test.test'
		}
	})),
	signInWithPopup: vi.fn(() => Promise.resolve({})),
	GoogleAuthProvider: vi.fn(),
	AuthErrorCodes: {
		EXPIRED_POPUP_REQUEST: 'auth/cancelled-popup-request',
		POPUP_BLOCKED: 'auth/popup-blocked',
		POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
		USER_DELETED: 'auth/user-not-found',
		INVALID_PASSWORD: 'auth/wrong-password',
		CREDENTIAL_ALREADY_IN_USE: 'auth/credential-already-in-use',
		EMAIL_EXISTS: 'auth/email-already-in-use'
	}
}))

describe('firebase.client', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it('verify variables', () => {
		expect(firebaseService.app).toBeTruthy()
		expect(firebaseService.app.name).toEqual('Test')
		expect(firebaseService.auth).toBeTruthy()
		expect(firebaseService.auth.currentUser).toBeTruthy()
		expect(firebaseService.auth.currentUser?.displayName).toEqual('Test')
		expect(firebaseService.auth.currentUser?.email).toEqual('test@test.test')
		expect(firebaseService.authFunctions).toBeTruthy()
	})

	it('auth functions signInWithPopup GOOGLE', async () => {
		const promise = firebaseService.authFunctions.signInWithPopup(
			FirebaseProviderEnum.GOOGLE,
			vi.fn()
		)
		expect(promise).toBeTruthy()
		expect(await promise).toBeTypeOf('object')
	})

	it('auth functions signInWithPopup FACEBOOK', () => {
		expect(() =>
			firebaseService.authFunctions.signInWithPopup(FirebaseProviderEnum.FACEBOOK, vi.fn())
		).toThrowError(/^Provider no implemented$/)
	})

	it('auth functions getError AUTH_PROVIDER', () => {
		const tags = {
			PROVIDER: FirebaseProviderEnum.GOOGLE
		}
		const [msg, isError] = firebaseService.authFunctions.getError(
			AuthErrorCodes.POPUP_BLOCKED,
			tags
		)

		expect(msg).toBeTruthy()
		expect(msg).toEqual(`Se presento un error al autenticar con ${tags.PROVIDER}`)
		expect(msg).toBeTypeOf('string')
		expect(isError).toBeTruthy()
		expect(isError).toBeTypeOf('boolean')
	})

	it('auth functions getError without code', () => {
		const [msg, isError] = firebaseService.authFunctions.getError(null)

		expect(msg).toBeTruthy()
		expect(msg).toEqual('Error inesperado. Por favor vuelva a intentarlo')
		expect(msg).toBeTypeOf('string')
		expect(isError).toBeTruthy()
		expect(isError).toBeTypeOf('boolean')
	})
})
