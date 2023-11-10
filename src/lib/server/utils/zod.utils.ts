import { z } from 'zod'

export const defaultString = z.string().min(1)
export const defaultNumber = z.number().min(1)

export default z
