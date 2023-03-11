import { NextApiRequest, NextApiResponse } from 'next'
import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { withApiSession } from '@libs/server/withSession'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    })
    res.json({
      ok: true,
      profile,
    })
  }
  if (req.method === 'POST') {
    const {
      session: { user },
      body: { email, phone, name },
    } = req
    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    })
    if (email && currentUser?.email !== email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: { email },
          select: { id: true },
        }),
      )
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: 'Email already exists',
        })
      }
      await client.user.update({
        where: { id: user?.id },
        data: { email },
      })
      return res.json({ ok: true })
    }
    if (name) {
      await client.user.update({
        where: { id: user?.id },
        data: { name },
      })
    }
    if (phone && currentUser?.phone !== phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: { phone },
          select: { id: true },
        }),
      )
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: 'Phone number already exists',
        })
      }
      await client.user.update({
        where: { id: user?.id },
        data: { phone },
      })
      return res.json({ ok: true })
    }

    res.json({ ok: true })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
)
