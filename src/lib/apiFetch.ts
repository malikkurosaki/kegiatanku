import { treaty } from '@elysiajs/eden'
import type { ServerApp } from '..'

const URL = process.env.BUN_PUBLIC_BASE_URL
if (!URL) {
  throw new Error('BUN_PUBLIC_BASE_URL is not defined')
}

const apiFetch = treaty<ServerApp>(URL)

export default apiFetch
