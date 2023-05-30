const pesosCOLocale = Intl.NumberFormat('en-CO')

export function money(value: number) {
	if (isNaN(value)) {
		value = 0
	}

	const isNegative = value < 0
	if (isNegative) {
		return `$(${pesosCOLocale.format(value * -1)})`
	} else {
		return `$${pesosCOLocale.format(value)}`
	}
}

export function zeroPad(num: number, places: number) {
	return String(num).padStart(places, '0')
}
