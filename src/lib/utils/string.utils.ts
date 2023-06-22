export function generateUniqueId(prefix: string) {
	if (crypto.randomUUID) {
		prefix = `${prefix}_${crypto.randomUUID()}`
	} else {
		prefix = `${prefix}_${new Date().getTime()}`
	}

	return prefix
}
