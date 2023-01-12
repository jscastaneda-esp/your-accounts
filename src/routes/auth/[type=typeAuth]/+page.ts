import type { PageLoad, PageData } from './$types';
import type { TypeAuthEnum } from '$lib/enums';
import type { PageDataAuth } from '$lib/types';

export const load: PageLoad<PageData> = async ({ params }): Promise<PageDataAuth> => {
	return {
		type: params.type as TypeAuthEnum
	};
};
