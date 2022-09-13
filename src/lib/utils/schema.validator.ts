import * as yup from 'yup';
import type { LocaleObject } from 'yup/lib/locale';

yup.setLocale({
	mixed: {
		required: 'Campo requerido'
	},
	string: {
		trim: 'Campo requerido',
		email: 'Email invalido',
		min: ({ min }) => `Mínimo ${min} caracteres`
	}
});

export const defaultText = yup.string().required();
export const email = yup.string().email().required();
export const password = yup.string().trim().min(8).required();

export default yup;
