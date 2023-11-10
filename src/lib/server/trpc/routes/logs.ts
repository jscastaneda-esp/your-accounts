/* eslint-disable @typescript-eslint/no-explicit-any */
import { t } from '../t'
import type { Log } from '$lib/types'
import z, { defaultNumber } from '$server/utils/zod.utils'
import { procedure } from '../middleware'
import { CodeLogEnum } from '$lib/enums'
import { TRPCError } from '@trpc/server'
import { API_URL } from '$env/static/private'
import { $fetch } from 'ofetch'

const baseURL = `${API_URL}/api/v1/log`

export const logs = t.router({
	getLogsByResourceId: procedure
		.input(
			z.object({
				resourceId: defaultNumber,
				code: z.nativeEnum(CodeLogEnum)
			})
		)
		.query(async ({ ctx, input }) => {
			return $fetch<Log[]>(`/${input.resourceId}/code/${input.code}`, {
				baseURL,
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				}
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		})
})
