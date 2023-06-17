import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

function redirectLogin() {
	return new Response(undefined, {
		status: 303,
		headers: { location: '/login' }
	})
}

const fnTRPCHandle = createTRPCHandle({ router, createContext })
export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/trpc') && !event.url.pathname.startsWith('/login')) {
		const token = event.cookies.get('jwt')

		try {
			if (!token) {
				throw new Error('Token not found')
			} else {
				jwt.verify(token, JWT_SECRET)
			}
		} catch (e: unknown) {
			console.log(event.url.pathname, e)
			return redirectLogin()
		}
	}

	return await fnTRPCHandle({ event, resolve })
}
