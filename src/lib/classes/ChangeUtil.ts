import type { Change, FelteError } from '../types';

export default class ChangeUtil<P extends string> {
	setChange(
		errorData: Record<string, FelteError>,
		newData: Record<string, unknown>,
		oldData: Record<string, unknown>,
		change: Change<Record<string, unknown>>,
		property: P,
		isChanges: boolean
	) {
		if (!errorData?.[property] && newData[property] != oldData[property]) {
			oldData[property] = newData[property];
			change.detail[property] = newData[property];
			isChanges = true;
		}

		return isChanges;
	}

	setChangeDirect(
		newValue: unknown,
		oldData: Record<string, unknown>,
		change: Change<Record<string, unknown>>,
		property: P,
		isChanges: boolean
	) {
		if (newValue != oldData[property]) {
			oldData[property] = newValue;
			change.detail[property] = newValue;
			isChanges = true;
		}

		return isChanges;
	}
}
