import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { Change } from './types';

export const session = writable<User | null>(null);

function changesStore() {
	const { subscribe, update } = writable<Change<Record<string, unknown>>[]>([]);

	let count = 1;

	return {
		subscribe,
		add: (newChange: Change<Record<string, unknown>>) =>
			update((changes) => {
				newChange.index = count++;
				return [...changes, newChange];
			}),
		revert: (newChanges: Change<Record<string, unknown>>[]) =>
			update((changes) => [...newChanges, ...changes]),
		delete: (delChanges: Change<Record<string, unknown>>[]) =>
			update((changes) =>
				changes.filter((change) => !delChanges.some((del) => change.index == del.index))
			)
	};
}
export const changes = changesStore();
