import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { Change } from './types';

export const session = writable<User | null>(null);

function changesStore() {
	const { subscribe, update } = writable<Change<unknown>[]>([]);

	let count = 1;

	return {
		subscribe,
		add: (newChange: Change<unknown>) =>
			update((changes) => {
				newChange.index = count++;
				return [...changes, newChange];
			}),
		revert: (newChanges: Change<unknown>[]) => update((changes) => [...newChanges, ...changes]),
		delete: (delChanges: Change<unknown>[]) =>
			update((changes) =>
				changes.filter((change) => !delChanges.some((del) => change.index == del.index))
			)
	};
}
export const changes = changesStore();
