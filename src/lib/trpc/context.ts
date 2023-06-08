import type { inferAsyncReturnType } from '@trpc/server'
import { JWT_SECRET } from '$env/static/private'
import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export async function createContext({ cookies }: RequestEvent) {
	try {
		const token = cookies.get('jwt')
		const { tokenApi } = jwt.verify(token || '', JWT_SECRET) as { tokenApi: string }
		return { tokenApi }
	} catch {
		return { tokenApi: '' }
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
