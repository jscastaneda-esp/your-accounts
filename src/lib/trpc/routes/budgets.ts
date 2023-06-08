import { BudgetBillCategory } from '../../enums'
import { t } from '../t'
import type { Budget, BudgetBillShared, BudgetBillTransaction, BudgetStatistics } from '../../types'
import z, { defaultNumber, defaultString } from '../../utils/zod.utils'
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
	getById: procedure.input(defaultNumber).query(async ({ input }) => {
		await delay(500)
		const budget: Budget = {
			id: input,
			name: 'Test',
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			fixedIncome: 6370000,
			additionalIncome: 0,
			totalBalance: 6370000,
			total: 0,
			estimatedBalance: 6370000,
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
	getStatisticsById: procedure.input(defaultNumber).query(async ({ input }) => {
		console.log(`Statistics to ${input}`)
		await delay(1000)
		const statistics: BudgetStatistics = {
			labels: ['PERSONAL', 'CASA', 'AHORRO', 'FINANCIERO', 'IMPUESTOS', 'OTROS'],
			pie: {
				data: [10, 20.5, 5, 50, 6.5, 80]
			},
			bar: {
				amount: {
					data: [12, 19, 3, 5, 2, 3]
				},
				payment: {
					data: [0, -19, 1, 4, 0, 4]
				}
			}
		}
		return statistics
	}),
	availables,
	bills
})
