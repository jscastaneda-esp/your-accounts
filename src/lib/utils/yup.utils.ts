import * as yup from 'yup';

yup.setLocale({
	mixed: {
		required: 'Ingresa un contenido válido'
	},
	string: {
		email: 'Ingresa un correo electrónico válido',
		min: ({ min }) => `Ingresa ${min} caracteres como mínimo`,
		max: ({ max }) => `Ingresa ${max} caracteres como máximo`,
		matches: () => 'Ingresa un contenido válido'
	},
	number: {
		min: ({ min }) => `Ingresa un valor superior o igual a ${min}`,
		max: ({ max }) => `Ingresa un valor inferior o igual a ${max}`
	}
});

export const defaultText = yup.string().required();
export const defaultNumber = yup.number().required();
export const email = yup.string().email().required();
export const password = yup.string().trim().min(8).required();

export default yup;
