import type { Change, ChangeStore } from '$lib/types'
import { writable, type Readable } from 'svelte/store'

export function changesStore(): Readable<Change[]> & ChangeStore {
	const { subscribe, update, set } = writable<Change[]>([])

	let count = 1

	return {
		subscribe,
		add: (newChange: Change) =>
			update((changes) => {
				newChange.index = count++
				return [...changes, newChange]
			}),
		revert: (newChanges: Change[]) => update((changes) => [...newChanges, ...changes]),
		delete: (delChanges: Change[]) =>
			update((changes) =>
				changes.filter((change) => !delChanges.some((del) => change.index == del.index))
			),
		clear: () => set([])
	}
}
