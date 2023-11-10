import { writable } from 'svelte/store'
import ConfirmPopupInfo, { type Action } from '../classes/ConfirmPopupInfo'

function screenLoadingStore() {
	const { subscribe, set } = writable<boolean>(false)

	return {
		subscribe,
		show: () => set(true),
		hide: () => set(false)
	}
}
export const screenLoading = screenLoadingStore()

function confirmPopupStore() {
	const { subscribe, update } = writable<ConfirmPopupInfo>(new ConfirmPopupInfo())

	return {
		subscribe,
		show: (question: string, description?: string, cbOk?: Action, cbCancel?: Action) => {
			return update((value) => {
				value.show = true
				value.question = question
				value.description = description

				if (cbOk) {
					value.actionOk = cbOk
				}

				if (cbCancel) {
					value.actionCancel = cbCancel
				}

				return value
			})
		}
	}
}
export const confirmPopup = confirmPopupStore()
