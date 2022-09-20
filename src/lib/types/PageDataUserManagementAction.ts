import type { UserManagementActionsEnum } from '$lib/enums/UserManagementActions.enum';

export interface PageDataUserManagementAction {
	mode: UserManagementActionsEnum;
	actionCode: string;
}
