/* eslint-disable @typescript-eslint/no-explicit-any */
import { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import { t } from '../t'
import type { Budget, BudgetMinimal } from '$lib/types'
import z, { defaultNumber, defaultString } from '$server/utils/zod.utils'
import { procedure } from '../middleware'
import { TRPCError } from '@trpc/server'
import { API_URL } from '$env/static/private'
import { $fetch } from 'ofetch'

const baseURL = `${API_URL}/api/v1/budget`

const availables = t.router({
	create: procedure
		.input(
			z.object({
				name: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(({ ctx, input }) => {
			return $fetch<{ id: number }>('/available', {
				baseURL,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				},
				body: input
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		})
})

const bills = t.router({
	create: procedure
		.input(
			z.object({
				description: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(({ ctx, input }) => {
			return $fetch<{ id: number }>('/bill', {
				baseURL,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				},
				body: {
					...input,
					category: BudgetBillCategory.OTHERS
				}
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		}),
	createTransaction: procedure
		.input(
			z.object({
				description: defaultString,
				amount: z.number(),
				billId: defaultNumber
			})
		)
		.mutation(({ ctx, input }) => {
			return $fetch<string>('/bill/transaction', {
				baseURL,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				},
				body: input
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		})
})

export const budgets = t.router({
	create: procedure
		.input(
			z.object({
				name: defaultString,
				cloneId: defaultNumber.optional()
			})
		)
		.mutation(({ ctx, input }) => {
			return $fetch<{ id: number }>('', {
				baseURL,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				},
				body: input
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		}),
	getByUserId: procedure.query(({ ctx }) => {
		return $fetch<BudgetMinimal[]>('', {
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
	}),
	getById: procedure.input(defaultNumber).query(({ ctx, input }) => {
		return $fetch<Budget>(`/${input}`, {
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
	}),
	delete: procedure.input(defaultNumber).mutation(({ ctx, input }) => {
		return $fetch<string>(`/${input}`, {
			baseURL,
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
			}
		}).catch((err) => {
			console.error(err)

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR'
			})
		})
	}),
	receiveChanges: procedure
		.input(
			z.object({
				id: defaultNumber,
				changes: z.array(
					z.object({
						id: defaultNumber,
						section: z.nativeEnum(ChangeSectionEnum),
						action: z.nativeEnum(ChangeActionEnum),
						detail: z.record(z.unknown())
					})
				)
			})
		)
		.mutation(({ ctx, input }) => {
			return $fetch<string>(`/${input.id}`, {
				baseURL,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${(ctx.session?.user as any).accessToken}`
				},
				body: input.changes
			}).catch((err) => {
				console.error(err)

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR'
				})
			})
		}),
	availables,
	bills
})
