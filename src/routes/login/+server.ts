import type { RequestHandler } from './$types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import { dev } from '$app/environment'
import { trytm } from '@bdsqqq/try'

export const POST = (async ({ cookies, request }) => {
	const [{ uuid, email }, error] = await trytm(request.json())
	if (error) {
		console.log(error)
		return new Response(null, { status: 401 })
	}

	const token = jwt.sign({ uuid, email, tokenApi: `<token>${uuid}` }, JWT_SECRET)
	cookies.set('jwt', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	})

	return new Response()
}) satisfies RequestHandler

export const DELETE = (async ({ cookies }) => {
	cookies.delete('jwt')
	return new Response()
}) satisfies RequestHandler
