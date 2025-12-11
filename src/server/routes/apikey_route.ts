/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JWTPayloadSpec } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'
import { type User } from 'generated/prisma'

import { prisma } from '../lib/prisma'

const NINETY_YEARS = 60 * 60 * 24 * 365 * 90 // in seconds

type JWT = {
  sign(data: Record<string, string | number> & JWTPayloadSpec): Promise<string>
  verify(
    jwt?: string
  ): Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
}

const ApiKeyRoute = new Elysia({
  prefix: '/apikey',
  detail: { tags: ['apikey'] },
})
  .post(
    '/create',
    async ctx => {
      const { user }: { user: User } = ctx as any
      const { name, description, expiredAt } = ctx.body
      const { sign } = (ctx as any).jwt as JWT

      // hitung expiredAt
      const exp = expiredAt
        ? Math.floor(new Date(expiredAt).getTime() / 1000) // jika dikirim
        : Math.floor(Date.now() / 1000) + NINETY_YEARS // default 90 tahun

      const token = await sign({
        sub: user.id,
        aud: 'host',
        exp,
        payload: JSON.stringify({
          name,
          description,
          expiredAt,
        }),
      })

      const apiKey = await prisma.apiKey.create({
        data: {
          name,
          description,
          key: token,
          userId: user.id,
          expiredAt: new Date(exp * 1000), // simpan juga di DB biar gampang query
        },
      })

      return { message: 'success', token, apiKey }
    },
    {
      detail: {
        summary: 'create api key',
      },
      body: t.Object({
        name: t.String(),
        description: t.String(),
        expiredAt: t.Optional(t.String({ format: 'date-time' })), // ISO date string
      }),
    }
  )
  .get(
    '/list',
    async ctx => {
      const { user }: { user: User } = ctx as any
      const apiKeys = await prisma.apiKey.findMany({
        where: {
          userId: user.id,
        },
      })
      return { message: 'success', apiKeys }
    },
    {
      detail: {
        summary: 'get api key list',
      },
    }
  )
  .delete(
    '/delete',
    async ctx => {
      const { id } = ctx.body as { id: string }
      const apiKey = await prisma.apiKey.delete({
        where: {
          id,
        },
      })
      return { message: 'success', apiKey }
    },
    {
      detail: {
        summary: 'delete api key',
      },
      body: t.Object({
        id: t.String(),
      }),
    }
  )

export default ApiKeyRoute
