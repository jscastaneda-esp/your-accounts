export enum HttpStatus {
	OK = 200,
	BAD_REQUEST = 400
}

export enum FirebaseProviderEnum {
	GOOGLE = 'Google',
	FACEBOOK = 'Facebook'
}

export enum TypeAuthEnum {
	LOGIN = 'login',
	SIGNUP = 'signup',
	SIGNOUT = 'signout',
	FORGOT_PASSWORD = 'forgot-password'
}

export enum TypeProjectEnum {
	BUDGET = 'BUDGET'
}

export enum UserManagementActionsEnum {
	resetPassword
}

export enum ChangeActionEnum {
	UPDATE = 'UPDATE',
	DELETE = 'DELETE'
}

export enum ChangeSectionEnum {
	BUDGET_MAIN = 'BUDGET_MAIN',
	BUDGET_AVAILABLE = 'BUDGET_AVAILABLE',
	BUDGET_BILL = 'BUDGET_BILL',
	BUDGET_BILL_SHARED = 'BUDGET_BILL_SHARED'
}

export enum ContextNameEnum {
	CHANGES = 'changes'
}
