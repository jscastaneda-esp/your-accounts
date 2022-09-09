import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const session = writable<User | null>(null);
