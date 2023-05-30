import type { PageLoad } from './$types'
import type { TypeAuthEnum } from '$lib/enums'

export const load = (async ({ params }) => ({
	type: params.type as TypeAuthEnum
})) satisfies PageLoad
