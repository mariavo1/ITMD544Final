import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ContentWrapper from 'components/ContentWrapper'
import { SyncLoader } from 'react-spinners'

type Props = {
  children: React.ReactElement
}

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter()
  const { data, status: sessionStatus } = useSession()
  const authorized = sessionStatus === 'authenticated'
  const unAuthorized = sessionStatus === 'unauthenticated'
  const loading = sessionStatus === 'loading'

  useEffect(() => {
    if (loading || !router.isReady) return
    if (unAuthorized) {
      router.push({
        pathname: '/auth',
        query: { returnUrl: router.asPath },
      })
    }
  }, [loading, unAuthorized, sessionStatus, router])

  if (loading) {
    return (
      <ContentWrapper>
        <SyncLoader
          loading={loading}
          aria-label="Loading Spinner"
          color="#f542cb"
        ></SyncLoader>
      </ContentWrapper>
    )
  }

  return authorized ? <div>{children}</div> : <></>
}
