import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import type { ProjectTransaction } from '$lib/types';
import { defaultNumber } from '$lib/utils/zod.utils';
import delay from 'delay';

export const transactions = t.router({
	getByProjectId: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			await delay(1000);
			const transactions: ProjectTransaction[] = [];
			for (let index = 1; index <= 5; index++) {
				transactions.push({
					description: `Cambio ${index}`,
					createdAt: new Date(),
					projectId: input
				});
			}
			return transactions;
		})
});
