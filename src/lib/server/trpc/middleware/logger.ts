import { t } from '../t'

export const logger = t.middleware(async ({ type, path, rawInput, next, ctx }) => {
	const requestId = crypto.randomUUID()
	const input = rawInput ?? 'N/A'

	console.log(
		`${new Date().toISOString()} - ${requestId} - ([${type}][${path}][${JSON.stringify(
			ctx
		)}]) - Executing with input`,
		JSON.stringify(input)
	)
	const result = await next()
	console.log(
		`${new Date().toISOString()} - ${requestId} - Execute with result ${
			result.ok ? 'OK' : 'ERR'
		}, output`,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		JSON.stringify((result as any).data)
	)
	return result
})
