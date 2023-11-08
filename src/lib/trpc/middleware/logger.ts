import { t } from '../t'

export const logger = t.middleware(async ({ type, path, rawInput, next, ctx }) => {
	const requestId = crypto.randomUUID()
	const input = rawInput ?? 'N/A'

	console.log(
		`${new Date().toISOString()} - ${requestId} - ([${type}][${path}][`,
		ctx,
		']) - Executing with input',
		JSON.stringify(input, null, '\t')
	)
	const result = await next()
	console.log(
		`${new Date().toISOString()} - ${requestId} - Execute with result ${result.ok ? 'OK' : 'ERR'}`
	)
	return result
})
