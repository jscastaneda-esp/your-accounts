import { toast } from 'svelte-sonner'

class Toast {
	static success(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.success(msg, {
			style: 'background: hsl(var(--su));'
		})
	}

	static info(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.info(msg, {
			style: 'background: hsl(var(--in));'
		})
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.error(msg, {
			style: 'background: hsl(var(--er));',
			duration: Number.POSITIVE_INFINITY
		})
	}

	static warning(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.warning(msg, {
			style: 'background: hsl(var(--wa));',
			duration: Number.POSITIVE_INFINITY
		})
	}

	static clear() {
		toast.dismiss()
	}
}

export default Toast
