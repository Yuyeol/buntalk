import { NextApiRequest, NextApiResponse } from 'next'
import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { withApiSession } from '@libs/server/withSession'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req
  if (req.method === 'POST') {
    const stream = await client.stream.create({
      data: {
        name,
        price: price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })
    res.json({
      ok: true,
      stream,
    })
  } else if (req.method === 'GET') {
    const streams = await client.stream.findMany({
      // pagination 시 api 10개만 받아오고 20개를 건너뛰고 싶을때.
      // 20개를 건너뛴 것은 3페이지일 때 (2page * 10) 스킵 후 다음 3page의 10개를 받아오게 하는것.
      take: 10,
      //   skip: 20,
    })
    res.json({
      ok: true,
      streams,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
)
