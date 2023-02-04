import { describe, expect, it, afterEach, vi } from 'vitest';
import { AuthErrorCodes } from 'firebase/auth';
import firebase from '../../../src/lib/configs/firebase.client';
import { FirebaseProviderEnum, TypeAuthEnum } from '../../../src/lib/enums';

vi.mock('$env/static/public', () => ({
	PUBLIC_FIREBASE_OPTIONS: Buffer.from('{"apiKey": "test"}').toString('base64')
}));

// vi.mock('$app/environment', () => ({
// 	browser: false
// }));

vi.mock('firebase/app', () => ({
	initializeApp: vi.fn(() => ({
		name: 'Test'
	}))
}));

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
}));

describe('firebase.client', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('verify variables', () => {
		expect(firebase.app).toBeTruthy();
		expect(firebase.app.name).toEqual('Test');
		expect(firebase.auth).toBeTruthy();
		expect(firebase.auth.currentUser).toBeTruthy();
		expect(firebase.auth.currentUser?.displayName).toEqual('Test');
		expect(firebase.auth.currentUser?.email).toEqual('test@test.test');
		expect(firebase.authFunctions).toBeTruthy();
	});

	it('auth functions signInWithPopup GOOGLE', async () => {
		const promise = firebase.authFunctions.signInWithPopup(FirebaseProviderEnum.GOOGLE, vi.fn());
		expect(promise).toBeTruthy();
		expect(await promise).toBeTypeOf('object');
	});

	it('auth functions signInWithPopup FACEBOOK', () => {
		expect(() =>
			firebase.authFunctions.signInWithPopup(FirebaseProviderEnum.FACEBOOK, vi.fn())
		).toThrowError(/^Provider no implemented$/);
	});

	it('auth functions getError AUTH_PROVIDER', () => {
		const tags = {
			PROVIDER: FirebaseProviderEnum.GOOGLE
		};
		const [msg, isError] = firebase.authFunctions.getError(
			TypeAuthEnum.LOGIN,
			AuthErrorCodes.POPUP_BLOCKED,
			tags
		);

		expect(msg).toBeTruthy();
		expect(msg).toEqual(`Se presento un error al autenticar con ${tags.PROVIDER}`);
		expect(msg).toBeTypeOf('string');
		expect(isError).toBeTruthy();
		expect(isError).toBeTypeOf('boolean');
	});

	it('auth functions getError User/Password Invalid', () => {
		const [msg, isError] = firebase.authFunctions.getError(
			TypeAuthEnum.LOGIN,
			AuthErrorCodes.USER_DELETED
		);

		expect(msg).toBeTruthy();
		expect(msg).toEqual('Correo electrónico y/o contraseña inválidos');
		expect(msg).toBeTypeOf('string');
		expect(isError).toBeFalsy();
		expect(isError).toBeTypeOf('boolean');
	});

	it('auth functions getError Email already exists', () => {
		const [msg, isError] = firebase.authFunctions.getError(
			TypeAuthEnum.SIGNUP,
			AuthErrorCodes.EMAIL_EXISTS
		);

		expect(msg).toBeTruthy();
		expect(msg).toEqual('Correo electrónico ya se encuentra registrado');
		expect(msg).toBeTypeOf('string');
		expect(isError).toBeFalsy();
		expect(isError).toBeTypeOf('boolean');
	});

	it('auth functions getError without code', () => {
		const [msg, isError] = firebase.authFunctions.getError(TypeAuthEnum.LOGIN, null);

		expect(msg).toBeTruthy();
		expect(msg).toEqual('Error inesperado. Por favor vuelva a intentarlo');
		expect(msg).toBeTypeOf('string');
		expect(isError).toBeTruthy();
		expect(isError).toBeTypeOf('boolean');
	});
});
