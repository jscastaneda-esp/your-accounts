import type { ParamMatcher } from '@sveltejs/kit';
import { TypeAuthEnum } from '$lib/enums/TypeAuth.enum';

export const match: ParamMatcher = (param: string): boolean => {
	return param === TypeAuthEnum.LOGIN || param === TypeAuthEnum.SIGNUP;
};
