import type { PageLoad, PageData } from './$types';
import type { TypeAuthEnum } from '$lib/enums/TypeAuth.enum';
import type { PageDataAuth } from '$lib/types/PageDataAuth';

export const load: PageLoad<PageData> = async ({ params }): Promise<PageDataAuth> => {
	return {
		type: params.type as TypeAuthEnum
	};
};
