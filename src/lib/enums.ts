export enum HttpStatus {
	OK = 200,
	BAD_REQUEST = 400
}

export enum FirebaseProviderEnum {
	GOOGLE = 'Google',
	FACEBOOK = 'Facebook'
}

export enum TypeProjectEnum {
	BUDGET = 'BUDGET'
}

export enum BudgetBillCategory {
	HOUSE = 'house',
	ENTERTAINMENT = 'entertainment',
	PERSONAL = 'personal',
	VEHICLE_TRANSPORTATION = 'vehicle_transportation',
	EDUCATION = 'education',
	SERVICES = 'services',
	SAVING = 'saving',
	OTHERS = 'others'
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
