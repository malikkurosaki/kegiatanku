/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwt as jwtPlugin, type JWTPayloadSpec } from '@elysiajs/jwt'
import Elysia, { t, type Cookie, type HTTPHeaders, type StatusMap } from 'elysia'
import { type ElysiaCookie } from 'elysia/cookies'

import { prisma } from '@/server/lib/prisma'

const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('Missing JWT_SECRET in environment variables')
}

const isProd = process.env.NODE_ENV === 'production'
const NINETY_YEARS = 60 * 60 * 24 * 365 * 90

type JWT = {
  sign(data: Record<string, string | number> & JWTPayloadSpec): Promise<string>
  verify(
    jwt?: string
  ): Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
}

type COOKIE = Record<string, Cookie<string | undefined>>

type SET = {
  headers: HTTPHeaders
  status?: number | keyof StatusMap
  redirect?: string
  cookie?: Record<string, ElysiaCookie>
}

async function issueToken({
  jwt,
  cookie,
  userId,
  role,
  expiresAt,
}: {
  jwt: JWT
  cookie: COOKIE
  userId: string
  role: 'host' | 'user'
  expiresAt: number
}) {
  const token = await jwt.sign({
    sub: userId,
    aud: role,
    exp: expiresAt,
  })

  cookie.token?.set({
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: NINETY_YEARS,
    path: '/',
  })

  return token
}

/* -----------------------
   REGISTER FUNCTION
-------------------------*/
async function register({
  body,
  cookie,
  set,
  jwt,
}: {
  body: { name: string; email: string; password: string }
  cookie: COOKIE
  set: SET
  jwt: JWT
}) {
  try {
    const { name, email, password } = body

    // cek existing user
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      set.status = 400
      return { message: 'Email already registered' }
    }

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // plaintext – bisa ditambah hash
      },
    })

    return {
      success: true,
      message: "User registered successfully"
    }

  } catch (err) {
    console.error('Error registering user:', err)
    set.status = 500
    return {
      message: 'Register failed',
      error:
        err instanceof Error ? err.message : JSON.stringify(err ?? null),
    }
  }
}

/* -----------------------
   LOGIN FUNCTION
-------------------------*/
async function login({
  body,
  cookie,
  set,
  jwt,
}: {
  body: { email: string; password: string }
  cookie: COOKIE
  set: SET
  jwt: JWT
}) {
  try {
    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      set.status = 401
      return { message: 'User not found' }
    }

    if (user.password !== password) {
      set.status = 401
      return { message: 'Invalid password' }
    }

    const token = await issueToken({
      jwt,
      cookie,
      userId: user.id,
      role: 'user',
      expiresAt: Math.floor(Date.now() / 1000) + NINETY_YEARS,
    })
    return { token }
  } catch (error) {
    console.error('Error logging in:', error)
    return {
      message: 'Login failed',
      error:
        error instanceof Error ? error.message : JSON.stringify(error ?? null),
    }
  }
}

/* -----------------------
   AUTH ROUTES
-------------------------*/
const Auth = new Elysia({
  prefix: '/auth',
  detail: { description: 'Auth API', summary: 'Auth API', tags: ['auth'] },
})
  .use(
    jwtPlugin({
      name: 'jwt',
      secret,
    })
  )

  /* REGISTER */
  .post(
    '/register',
    async ({ jwt, body, cookie, set }) => {
      return await register({
        jwt: jwt as JWT,
        body,
        cookie: cookie as any,
        set: set as any,
      })
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
      detail: {
        description: 'Register new account',
        summary: 'register',
      },
    }
  )

  /* LOGIN */
  .post(
    '/login',
    async ({ jwt, body, cookie, set }) => {
      return await login({
        jwt: jwt as JWT,
        body,
        cookie: cookie as any,
        set: set as any,
      })
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      detail: {
        description: 'Login with email + password',
        summary: 'login',
      },
    }
  )

  /* LOGOUT */
  .delete(
    '/logout',
    ({ cookie }) => {
      cookie.token?.remove()
      return { message: 'Logout successful' }
    },
    {
      detail: {
        description: 'Logout (clear token cookie)',
        summary: 'logout',
      },
    }
  )

export default Auth
