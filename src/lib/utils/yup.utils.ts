import * as yup from 'yup';

yup.setLocale({
	mixed: {
		required: 'Ingresa un contenido válido'
	},
	string: {
		email: 'Ingresa un correo electrónico válido',
		min: ({ min }) => `Ingresa ${min} caracteres como mínimo`
	}
});

export const defaultText = yup.string().required();
export const email = yup.string().email().required();
export const password = yup.string().trim().min(8).required();

export default yup;
