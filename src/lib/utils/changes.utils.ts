import type { Change, FelteError } from '$lib/types'

export class ChangesUtil<P extends string> {
	setChange(
		errorData: Record<string, FelteError>,
		newData: Record<string, unknown>,
		oldData: Record<string, unknown>,
		change: Change<Record<string, unknown>>,
		property: P,
		isChanges: boolean
	) {
		if (!errorData?.[property]) {
			isChanges = this.setChangeDirect(newData[property], oldData, change, property, isChanges)
		}

		return isChanges
	}

	setChangeDirect(
		newValue: unknown,
		oldData: Record<string, unknown>,
		change: Change<Record<string, unknown>>,
		property: P,
		isChanges: boolean
	) {
		if (newValue != oldData[property]) {
			oldData[property] = newValue
			change.detail[property] = newValue
			isChanges = true
		}

		return isChanges
	}
}
