import { toast } from '@zerodevx/svelte-toast'
import ToastError from '$components/shared/alerts/ToastError.svelte'
import ToastWarn from '$components/shared/alerts/ToastWarn.svelte'
import ToastSuccess from '$components/shared/alerts/ToastSuccess.svelte'
import type { SvelteComponent } from 'svelte'
import ToastInfo from '$components/shared/alerts/ToastInfo.svelte'

class Toast {
	private static add(
		component: typeof SvelteComponent,
		msg: string,
		theme: Record<string, string>,
		autoHidden = true
	) {
		toast.push({
			initial: autoHidden ? 1 : 0,
			theme,
			component: {
				src: component,
				props: {
					message: msg
				}
			}
		})
	}

	static info(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		Toast.add(ToastInfo, msg, {
			'--toastBackground': '#2563eb'
		})
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		Toast.add(
			ToastError,
			msg,
			{
				'--toastBackground': '#dc2626'
			},
			false
		)
	}

	static warn(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		Toast.add(
			ToastWarn,
			msg,
			{
				'--toastBackground': '#d97706'
			},
			false
		)
	}

	static success(msg: string, clear = false) {
		if (clear) {
			this.clear()
		}

		Toast.add(ToastSuccess, msg, {
			'--toastBackground': '#16a34a'
		})
	}

	static clear() {
		toast.pop(0)
	}
}

export default Toast
