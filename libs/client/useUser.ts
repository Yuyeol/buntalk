import { User } from '@prisma/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

interface ProfileResponse {
  ok: boolean
  profile: User
}

// middleware 사용으로 인해 필요 없어진 코드인듯. 페이지 로드 되기 전에 미들웨어에서 처리하고 있음.
export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>('/api/users/me')
  const router = useRouter()
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/enter')
    }
  }, [data, router])
  return { user: data?.profile, isLoading: !data && !error }
}
