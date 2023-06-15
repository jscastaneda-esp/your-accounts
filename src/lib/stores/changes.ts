import type { Change, ChangeStore } from "$lib/types"
import { writable, type Readable } from "svelte/store"

export function changesStore(): Readable<Change<unknown>[]> & ChangeStore<unknown> {
	const { subscribe, update } = writable<Change<unknown>[]>([])

	let count = 1

	return {
		subscribe,
		add: (newChange: Change<unknown>) =>
			update((changes) => {
				newChange.index = count++
				return [...changes, newChange]
			}),
		revert: (newChanges: Change<unknown>[]) =>
			update((changes) => [...newChanges, ...changes]),
		delete: (delChanges: Change<unknown>[]) =>
			update((changes) =>
				changes.filter((change) => !delChanges.some((del) => change.index == del.index))
			)
	}
}