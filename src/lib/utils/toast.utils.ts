import { toast } from 'svelte-sonner'

class Toast {
	static success(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.success(msg)
	}

	static info(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.info(msg)
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.error(msg, {
			duration: Number.POSITIVE_INFINITY
		})
	}

	static warning(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		toast.warning(msg, {
			duration: Number.POSITIVE_INFINITY
		})
	}

	static clear() {
		toast.dismiss()
	}
}

export default Toast
