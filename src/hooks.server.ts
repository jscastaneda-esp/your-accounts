import { createContext } from '$lib/server/trpc/context'
import { router } from '$lib/server/trpc/routes'
import { createTRPCHandle } from 'trpc-sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import { handle as authHandle } from './auth'

const tRPCHandle = createTRPCHandle({ router, createContext })

export const handle = sequence(authHandle, tRPCHandle)
