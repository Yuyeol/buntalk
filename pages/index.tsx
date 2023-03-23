import type { NextPage } from 'next'
import FloatingButton from '@components/floating-button'
import Item from '@components/item'
import Layout from '@components/layout'
import Head from 'next/head'
import useSWR, { SWRConfig } from 'swr'
import { Product } from '@prisma/client'
import client from '@libs/server/client'

export interface ProductWithCount extends Product {
  _count: {
    favs: number
  }
}

interface ProductsResponse {
  ok: boolean
  products: ProductWithCount[]
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>(
    typeof window === 'undefined' ? null : '/api/products',
  )
  return (
    <Layout title="홈" hasTabBar seoTitle="홈">
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.favs}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  )
}
const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    // SWR에서 캐싱 되기 전 초기값이 getServerSideProps에서 가져온 값으로 설정됩니다. 이렇게 하면 로딩을 안보여줘도 됩니다.
    // 이렇게 되면 SSR과 SWR의 효과를 모두 얻을 수 있습니다.
    <SWRConfig
      value={{
        fallback: {
          '/api/products': {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

export async function getServerSideProps() {
  const products = await client.product.findMany({
    include: {
      _count: {
        select: {
          favs: true,
        },
      },
    },
  })
  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  }
}

export default Page
