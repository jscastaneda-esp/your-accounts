import * as yup from 'yup'

yup.setLocale({
	mixed: {
		required: 'Ingresa un contenido válido'
	},
	string: {
		email: 'Ingresa un correo electrónico válido',
		min: ({ min }: { min: number }) => `Ingresa ${min} caracteres como mínimo`,
		max: ({ max }: { max: number }) => `Ingresa ${max} caracteres como máximo`,
		matches: () => 'Ingresa un contenido válido'
	},
	number: {
		min: ({ min }: { min: number }) => `Ingresa un valor superior o igual a ${min}`,
		max: ({ max }: { max: number }) => `Ingresa un valor inferior o igual a ${max}`
	}
})

export const defaultString = yup.string().required()
export const defaultNumber = yup.number().required()
export const defaultBoolean = yup.boolean().required()
export const email = yup.string().email().required()
export const password = yup.string().trim().min(8).required()

export default yup
