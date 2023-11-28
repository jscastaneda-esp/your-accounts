import { BudgetBillCategory } from '$lib/enums'

export function categoryTranslate(category: string) {
	switch (category) {
		case BudgetBillCategory.HOUSE:
			return 'Hogar'
		case BudgetBillCategory.ENTERTAINMENT:
			return 'Entretenimiento'
		case BudgetBillCategory.PERSONAL:
			return 'Personal'
		case BudgetBillCategory.VEHICLE_TRANSPORTATION:
			return 'Vehículo o Transporte'
		case BudgetBillCategory.EDUCATION:
			return 'Educación'
		case BudgetBillCategory.SERVICES:
			return 'Servicios'
		case BudgetBillCategory.FINANCIAL:
			return 'Financiero'
		case BudgetBillCategory.SAVING:
			return 'Ahorros'
		case BudgetBillCategory.OTHERS:
			return 'Otros'
	}
}
