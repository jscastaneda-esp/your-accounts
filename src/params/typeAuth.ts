import type { ParamMatcher } from '@sveltejs/kit';
import { TypeAuthEnum } from '$lib/enums';

export const match: ParamMatcher = (param: string): boolean => {
	return param === TypeAuthEnum.LOGIN || param === TypeAuthEnum.SIGNUP;
};
