import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { Change } from './types';

export const session = writable<User | null>(null);

function changesStore() {
	const { subscribe, update } = writable<Change[]>([]);

	let count = 1;

	return {
		subscribe,
		add: (change: Change) =>
			update((changes) => {
				change.index = count++;
				return [...changes, change];
			}),
		delete: (delChanges: Change[]) =>
			update((changes) =>
				changes.filter((change) => !delChanges.some((del) => change.index == del.index))
			)
	};
}
export const changes = changesStore();
