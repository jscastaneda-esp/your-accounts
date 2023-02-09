import type { MiddlewareFunction, ProcedureParams } from '@trpc/server';
import { t } from '../t';

const middleware: MiddlewareFunction<ProcedureParams, ProcedureParams> = async ({
	type,
	path,
	rawInput,
	next
}) => {
	const input = rawInput ?? 'N/A';

	console.log(`${new Date().toISOString()} ([${type}][${path}]) - Init execute with input`, input);
	const result = await next();
	console.log(
		`${new Date().toISOString()} ([${type}][${path}]) - Execute with input`,
		input,
		`result ${result.ok ? 'OK' : 'ERR'}`
	);
	return result;
};

export const logger = t.middleware(middleware);
