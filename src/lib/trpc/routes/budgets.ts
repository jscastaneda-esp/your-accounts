import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import type {
	Budget,
	BudgetBillShared,
	BudgetBillTransaction,
	BudgetStatistics,
	CategoryBill
} from '$lib/types';
import z, { defaultNumber, defaultString } from '$lib/utils/zod.utils';
import delay from 'delay';

const availables = t.router({
	create: t.procedure
		.use(logger)
		.input(
			z.object({
				name: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000);
			const available = {
				id: new Date().getTime(),
				budgetId: input.budgetId
			};
			return available;
		})
});

const bills = t.router({
	create: t.procedure
		.use(logger)
		.input(
			z.object({
				description: defaultString,
				budgetId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000);
			const bill = {
				id: new Date().getTime(),
				budgetId: input.budgetId
			};
			return bill;
		}),
	createTransaction: t.procedure
		.use(logger)
		.input(
			z.object({
				description: defaultString,
				amount: z.number(),
				budgetBillId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			console.log('Register transaction bill', input);
			await delay(1000);
			return true;
		}),
	getTransactionsById: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			await delay(1000);
			const transactions: BudgetBillTransaction[] = [];
			for (let index = 1; index <= 4; index++) {
				transactions.push({
					description: `Compra ${index}`,
					amount: (index % 2 == 0 ? index * -1 : index) * 1000,
					createdAt: new Date(),
					budgetBillId: input
				});
			}
			return transactions;
		}),
	createShared: t.procedure
		.use(logger)
		.input(
			z.object({
				description: defaultString,
				budgetBillId: defaultNumber
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000);
			const shared = {
				id: new Date().getTime(),
				budgetId: input.budgetBillId
			};
			return shared;
		}),
	getSharedById: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			await delay(1000);
			const shared: BudgetBillShared[] = [];
			if (input == 1) {
				shared.push({
					id: 1,
					description: 'Lau',
					amount: 100000,
					budgetBillId: input
				});
			}
			return shared;
		})
});

export const budgets = t.router({
	getById: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			await delay(1000);
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
						categoryId: '4',
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
						categoryId: '1',
						totalShared: 0
					}
				],
				projectId: 1
			};
			return budget;
		}),
	getStatisticsById: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			console.log(`Statistics to ${input}`);
			await delay(1000);
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
			};
			return statistics;
		}),
	getCategories: t.procedure.use(logger).query(async () => {
		await delay(1000);
		const types = [
			{ type: 'PERSONAL', color: '#f59e0b' },
			{ type: 'CASA', color: '#6366f1' },
			{ type: 'AHORRO', color: '#22c55e' },
			{ type: 'FINANCIERO', color: '#0ea5e9' },
			{ type: 'IMPUESTOS', color: '#ef4444' },
			{ type: 'OTROS', color: '#737373' }
		];

		const categories: CategoryBill[] = [];
		for (let i = 0; i < types.length; i++) {
			categories.push({
				id: i + 1,
				name: types[i].type,
				color: types[i].color
			});
		}

		return categories;
	}),
	availables,
	bills
});
