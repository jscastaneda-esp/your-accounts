import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { UserManagementActionsEnum } from '$lib/enums';

export const load = (async ({ url }) => {
	let modeStr: string | null = null;
	let actionCode: string | null = null;

	if (url.searchParams) {
		modeStr = url.searchParams.get('mode');
		actionCode = url.searchParams.get('oobCode');
	}

	let mode: UserManagementActionsEnum | null = null;
	if (modeStr) {
		mode = UserManagementActionsEnum[modeStr as keyof typeof UserManagementActionsEnum];
	}

	if (mode === undefined || mode === null || !actionCode) {
		throw redirect(307, '/auth/login');
	}

	return {
		mode,
		actionCode
	};
}) satisfies PageLoad;
