import { createContext } from '$lib/server/trpc/context'
import { router } from '$lib/server/trpc/routes'
import { SvelteKitAuth } from '@auth/sveltekit'
import Credentials from '@auth/core/providers/credentials'
import Google from '@auth/core/providers/google'
import { createTRPCHandle } from 'trpc-sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import { AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private'
import { trytm } from '@bdsqqq/try'

const fnSvelteKitAuth = SvelteKitAuth({
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				username: { type: 'text' },
				password: { type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials.username || !credentials.password) {
					console.error('Warning: Empty credentials provided')
					return null
				}

				if (
					(credentials.username as string).toLowerCase() != 'test@jsc-developer.com' ||
					credentials.password != 'P4s5W0rd*'
				) {
					console.error('Warning: Malicious login attempt registered, bad credentials provided')
					return null
				}

				return {
					id: '1',
					name: 'Usuario Pruebas',
					email: 'test@jsc-developer.com',
					image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
				}
			}
		}),
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		})
	],
	secret: AUTH_SECRET,
	pages: {
		signIn: '/login',
		error: '/login'
	},
	trustHost: true,
	callbacks: {
		async signIn({ user, profile }) {
			let email: string | undefined | null
			if (user) {
				email = user.email
			} else {
				email = profile?.email
			}

			if (!email) {
				return false
			}

			const [_, error] = await trytm(router.users.createCaller({ session: null }).create({ email }))
			if (error && error.message !== 'CONFLICT') {
				return false
			}

			return true
		},
		async jwt({ token, user }) {
			if (!token.email) {
				return {
					error: 'AccessDenied'
				}
			}

			if (
				!token.accessToken ||
				(token.accessTokenExpires && Date.now() > (token.accessTokenExpires as number))
			) {
				const [result, error] = await trytm(
					router.users.createCaller({ session: null }).login({ email: token.email })
				)
				if (error) {
					return {
						error: 'RefreshAccessTokenError'
					}
				}

				token.accessToken = result.token
				token.accessTokenExpires = result.expiresAt
			}

			return {
				...token,
				...user
			}
		},
		session({ session, token }) {
			session.user = {
				id: '0',
				...session.user,
				...token
			}

			return session
		}
	}
})
const fnTRPCHandle = createTRPCHandle({ router, createContext })

export const handle = sequence(fnSvelteKitAuth, fnTRPCHandle)
