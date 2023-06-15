import { BudgetBillCategory } from '$lib/enums'
import { t } from '../t'
import type {
	Budget,
	BudgetBillShared,
	BudgetBillTransaction,
	BudgetMinimal,
	BudgetStatistics
} from '$lib/types'
import z, { defaultNumber, defaultString } from '$utils/zod.utils'
import delay from 'delay'
import { procedure } from '../middleware'
import { categoryTranslate } from '$utils/i18n'

const availables = t.router({
	create: procedure
		.input(
			z.object({
				name: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000)
			const available = {
				id: new Date().getTime(),
				budgetId: input.budgetId
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
		.mutation(async ({ input }) => {
			await delay(1000)
			const bill = {
				id: new Date().getTime(),
				budgetId: input.budgetId
			}
			return bill
		}),
	createTransaction: procedure
		.input(
			z.object({
				description: defaultString,
				amount: z.number(),
				budgetBillId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			console.log('Register transaction bill', input)
			await delay(1000)
			return true
		}),
	getTransactionsById: procedure.input(defaultNumber).query(async ({ input }) => {
		await delay(1000)
		const transactions: BudgetBillTransaction[] = []
		for (let index = 1; index <= 4; index++) {
			transactions.push({
				description: `Compra ${index}`,
				amount: (index % 2 == 0 ? index * -1 : index) * 1000,
				createdAt: new Date(),
				budgetBillId: input
			})
		}
		return transactions
	}),
	createShared: procedure
		.input(
			z.object({
				description: defaultString,
				budgetBillId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000)
			const shared = {
				id: new Date().getTime(),
				budgetId: input.budgetBillId
			}
			return shared
		}),
	getSharedById: procedure.input(defaultNumber).query(async ({ input }) => {
		await delay(1000)
		const shared: BudgetBillShared[] = []
		if (input == 1) {
			shared.push({
				id: 1,
				description: 'Lau',
				amount: 100000,
				budgetBillId: input
			})
		}
		return shared
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
			const project = {
				id: new Date().getTime()
			}
			return project
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
			fixedIncome: 6370000,
			additionalIncome: 0,
			availableBalances: [
				{
					id: 1,
					name: 'Cuenta Ahorros',
					amount: 6370000,
					budgetId: input
				}
			],
			bills: [
				{
					id: 1,
					description: 'Pagos financieros',
					amount: 1000000,
					payment: 0,
					shared: true,
					dueDate: '10',
					complete: false,
					budgetId: input,
					category: BudgetBillCategory.SERVICES,
					totalShared: 100000
				},
				{
					id: 2,
					description: 'Pagos personales',
					amount: 2000000,
					payment: 0,
					shared: false,
					dueDate: '',
					complete: false,
					budgetId: input,
					category: BudgetBillCategory.PERSONAL,
					totalShared: 0
				}
			],
			projectId: 1
		}
		return budget
	}),
	getStatisticsById: procedure.input(defaultNumber).query(async () => {
		await delay(1000)

		const categories = Object.values(BudgetBillCategory).map((category) =>
			categoryTranslate(category)
		) as string[]
		const statistics: BudgetStatistics = {
			categories,
			amount: {
				data: [100000, 1350000, 55000, 2000000, 87420, 100000, 1800000, 80000]
			},
			payment: {
				data: [0, 0, 60000, 400000, 0, 100000, 0, 10000]
			}
		}
		return statistics
	}),
	delete: procedure.input(defaultNumber).mutation(async () => {
		await delay(1000)
		return
	}),
	availables,
	bills
})
