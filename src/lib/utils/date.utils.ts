import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.locale('es')
dayjs.extend(relativeTime)

export function now() {
	return dayjs()
}

export function toDate(dateStr: string, format: string) {
	return dayjs(dateStr, format)
}

export function showLogDate(compare: Dayjs, dateJS: Date) {
	const date = dayjs(dateJS)
	if (date.isBefore(compare)) {
		return date.format('D/MM/YY H:mm')
	}

	return date.fromNow()
}
