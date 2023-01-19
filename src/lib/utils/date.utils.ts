import { DateTime } from 'luxon';

export function today(): DateTime {
	return DateTime.now();
}

export function isoToFormat(date: string, format: string): string {
	return DateTime.fromISO(date).toFormat(format);
}

export function fromFormat(date: string, format: string): DateTime {
	return DateTime.fromFormat(date, format);
}
