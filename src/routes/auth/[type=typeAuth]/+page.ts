import type { PageLoad, PageData } from './$types';
import type { TypeAuthEnum } from '$lib/enums/typeAuth.enum';
import type { PageDataAuth } from '$lib/interfaces/PageDataAuth';

export const load: PageLoad<PageData> = async ({ params }): Promise<PageDataAuth> => {
	return {
		type: params.type as TypeAuthEnum
	};
};
