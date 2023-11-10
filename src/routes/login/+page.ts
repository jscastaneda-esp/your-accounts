import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => {
	return {
		error: url.searchParams.get('error')
	}
}
