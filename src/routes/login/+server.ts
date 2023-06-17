import type { RequestHandler } from './$types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import { dev } from '$app/environment'

export const POST = (async ({ cookies, request }) => {
	try {
		const { uuid, email } = await request.json()

		const token = jwt.sign({ uuid, email, tokenApi: `<token>${uuid}` }, JWT_SECRET)
		cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		})

		return new Response()
	} catch (err) {
		console.log(err)
		return new Response(null, { status: 401 })
	}
}) satisfies RequestHandler

export const DELETE = (async ({ cookies }) => {
	cookies.delete('jwt')
	return new Response()
}) satisfies RequestHandler
