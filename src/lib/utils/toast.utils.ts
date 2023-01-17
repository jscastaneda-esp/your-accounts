import { toast } from '@zerodevx/svelte-toast';
import DefaultToast from '../components/DefaultToast.svelte';
import ErrorToast from '../components/ErrorToast.svelte';
import WarnToast from '../components/WarnToast.svelte';
import SuccessToast from '../components/SuccessToast.svelte';
import type { SvelteComponent } from 'svelte';

class Toast {
	private static add(
		component: typeof SvelteComponent,
		msg: string,
		theme: { [key: string]: string },
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

		Toast.add(DefaultToast, msg, {
			'--toastColor': '#ffffff'
		});
	}

	static error(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(
			ErrorToast,
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

		Toast.add(WarnToast, msg, {
			'--toastBackground': '#fde68a',
			'--toastBarBackground': '#F59E0B'
		});
	}

	static success(msg: string, clear = false) {
		if (clear) {
			this.clear();
		}

		Toast.add(SuccessToast, msg, {
			'--toastBackground': '#86efac',
			'--toastBarBackground': '#22c55e'
		});
	}

	static clear() {
		toast.pop(0);
	}
}

export default Toast;
