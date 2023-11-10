import { t } from '../t'
import z, { defaultString } from '$server/utils/zod.utils'
import { publicProcedure } from '../middleware'
import { TRPCError } from '@trpc/server'
import { API_URL } from '$env/static/private'
import { $fetch } from 'ofetch'

export const users = t.router({
	create: publicProcedure
		.input(
			z.object({
				email: defaultString.email()
			})
		)
		.mutation(({ input }) => {
			return $fetch<{ id: number }>('/user', {
				baseURL: API_URL,
				method: 'POST',
				body: input
			}).catch((err) => {
				if (err.status == 409) {
					throw new TRPCError({
						code: 'CONFLICT'
					})
				}

				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		}),
	login: publicProcedure
		.input(
			z.object({
				email: defaultString.email()
			})
		)
		.mutation(({ input }) => {
			return $fetch<{ token: string; expiresAt: number }>('/login', {
				baseURL: API_URL,
				method: 'POST',
				body: input
			}).catch((err) => {
				console.error(err)

				if (err.status == 409) {
					throw new TRPCError({
						code: 'CONFLICT'
					})
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		})
})
