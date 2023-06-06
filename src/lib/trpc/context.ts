import type { inferAsyncReturnType } from '@trpc/server'
import { JWT_SECRET } from '$env/static/private'
import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export async function createContext({ cookies }: RequestEvent) {
	console.log(cookies.getAll())

	try {
		const token = cookies.get('jwt')
		// 👆 or, if we're using HTTP headers based authentication, we could do something like this:
		// const token = event.request.headers.get('authorization')?.replace('Bearer ', '');

		const { id: userId } = jwt.verify(token || '', JWT_SECRET) as { id: string }

		return { userId }
	} catch {
		return { userId: '' }
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
