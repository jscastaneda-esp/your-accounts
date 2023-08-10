import { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import { t } from '../t'
import type { Budget, BudgetBillTransaction, BudgetMinimal } from '$lib/types'
import z, { defaultNumber, defaultString } from '$utils/zod.utils'
import delay from 'delay'
import { procedure } from '../middleware'

const availables = t.router({
	create: procedure
		.input(
			z.object({
				name: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(async () => {
			await delay(1000)
			const available = {
				id: new Date().getTime()
			}
			return available
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
		.mutation(async () => {
			await delay(1000)
			const bill = {
				id: new Date().getTime()
			}
			return bill
		}),
	createTransaction: procedure
		.input(
			z.object({
				description: defaultString,
				amount: z.number(),
				billId: defaultNumber
			})
		)
		.mutation(async () => {
			await delay(1000)
		}),
	getTransactionsById: procedure.input(defaultNumber).query(async () => {
		await delay(1000)
		const transactions: BudgetBillTransaction[] = []
		for (let index = 1; index <= 10; index++) {
			const createdAt = new Date()
			if (index > 8) {
				createdAt.setMonth(createdAt.getMonth() - index)
			} else if (index > 5) {
				createdAt.setDate(createdAt.getDate() - index)
			} else if (index > 3) {
				createdAt.setHours(createdAt.getHours() - index)
			} else {
				createdAt.setSeconds(createdAt.getSeconds() - 10)
				createdAt.setMinutes(createdAt.getMinutes() - index + 1)
			}

			transactions.push({
				description: `Compra ${index}`,
				amount: (index % 2 == 0 ? index * -1 : index) * 1000,
				createdAt: createdAt
			})
		}
		return transactions
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
		.mutation(async () => {
			await delay(1000)
			const budget = {
				id: new Date().getTime()
			}
			return budget
		}),
	getByUserId: procedure.query(async () => {
		await delay(1000)
		const budgets: BudgetMinimal[] = [
			{
				id: 1,
				name: 'Test',
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 3,
				totalAvailableBalance: 100000,
				totalPendingPayment: 10000,
				totalBalance: 90000,
				pendingBills: 1
			},
			{
				id: 2,
				name: 'Test 2',
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 2,
				totalAvailableBalance: 7000000,
				totalPendingPayment: 6000000,
				totalBalance: 1000000,
				pendingBills: 10
			},
			{
				id: 3,
				name: 'Test 3',
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				totalAvailableBalance: 10000,
				totalPendingPayment: 60000,
				totalBalance: -50000,
				pendingBills: 2
			},
			{
				id: 4,
				name: 'Test 4',
				year: new Date().getFullYear(),
				month: new Date().getMonth(),
				totalAvailableBalance: -10500,
				totalPendingPayment: 40000,
				totalBalance: -50500,
				pendingBills: 1
			}
		]
		return budgets
	}),
	getById: procedure.input(defaultNumber).query(async ({ input }) => {
		await delay(500)
		const budget: Budget = {
			id: input,
			name: 'Test',
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			fixedIncome: 6470000,
			additionalIncome: 0,
			availableBalances: [
				{
					id: 1,
					name: 'Cuenta Ahorros',
					amount: 6470000
				}
			],
			bills: [
				{
					id: 1,
					description: 'Pagos financieros',
					amount: 1500000,
					payment: 0,
					dueDate: '10',
					complete: false,
					category: BudgetBillCategory.SERVICES
				},
				{
					id: 2,
					description: 'Pagos personales',
					amount: 2000000,
					payment: 0,
					dueDate: '',
					complete: false,
					category: BudgetBillCategory.PERSONAL
				}
			]
		}
		return budget
	}),
	delete: procedure.input(defaultNumber).mutation(async () => {
		await delay(1000)
	}),
	receiveChanges: procedure
		.input(
			z.object({
				id: z.number(),
				changes: z.array(
					z.object({
						index: z.number().optional(),
						section: z.nativeEnum(ChangeSectionEnum),
						action: z.nativeEnum(ChangeActionEnum),
						detail: z
							.object({
								id: z.number()
							})
							.and(z.record(z.unknown()))
					})
				)
			})
		)
		.mutation(async () => {
			await delay(1000)
		}),
	availables,
	bills
})
