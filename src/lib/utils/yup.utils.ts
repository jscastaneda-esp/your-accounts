import * as yup from 'yup'

yup.setLocale({
	mixed: {
		required: 'El campo es obligatorio'
	},
	string: {
		email: 'El campo debe ser un correo electrónico válido',
		min: ({ min }: { min: number }) => `El campo debe tener al menos ${min} caracteres`,
		max: ({ max }: { max: number }) => `El campo no debe ser mayor a ${max} caracteres`,
		matches: () => 'El formato del campo no es válido'
	},
	number: {
		min: ({ min }: { min: number }) => `El campo debe ser ${min} o superior`,
		max: ({ max }: { max: number }) => `El campo debe ser ${max} o menor`
	}
})

export const defaultString = yup.string().required()
export const defaultNumber = yup.number().required()
export const defaultBoolean = yup.boolean().required()

export default yup
