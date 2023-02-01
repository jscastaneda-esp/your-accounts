import { toast } from '@zerodevx/svelte-toast';
import ToastDefault from '../components/alerts/ToastDefault.svelte';
import ToastError from '../components/alerts/ToastError.svelte';
import ToastWarn from '../components/alerts/ToastWarn.svelte';
import ToastSuccess from '../components/alerts/ToastSuccess.svelte';
import type { SvelteComponent } from 'svelte';

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
		});
	}

	static info(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(ToastDefault, msg, {
			'--toastColor': '#ffffff'
		});
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(
			ToastError,
			msg,
			{
				'--toastBackground': '#fca5a5',
				'--toastBarBackground': '#ef4444'
			},
			false
		);
	}

	static warn(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(ToastWarn, msg, {
			'--toastBackground': '#fde68a',
			'--toastBarBackground': '#F59E0B'
		});
	}

	static success(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(ToastSuccess, msg, {
			'--toastBackground': '#86efac',
			'--toastBarBackground': '#22c55e'
		});
	}

	static clear() {
		toast.pop(0);
	}
}

export default Toast;
