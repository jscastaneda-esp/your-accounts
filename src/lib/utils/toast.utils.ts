import { toast } from 'svelte-sonner'

class Toast {
	static success(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.success(msg, {
			style: 'background: var(--fallback-su,oklch(var(--su)/1));'
		})
	}

	static info(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.info(msg, {
			style: 'background: var(--fallback-in,oklch(var(--in)/1));'
		})
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.error(msg, {
			style: 'background: var(--fallback-er,oklch(var(--er)/1));',
			duration: Number.POSITIVE_INFINITY
		})
	}

	static warning(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.warning(msg, {
			style: 'background: var(--fallback-wa,oklch(var(--wa)/1));',
			duration: Number.POSITIVE_INFINITY
		})
	}

	static clear() {
		toast.dismiss()
	}
}

export default Toast
