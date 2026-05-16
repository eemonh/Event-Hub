import { Outlet, useLocation } from 'react-router-dom'
import MainHeader from '../components/MainHeader'

const noHeaderRoutes = ['/', '/dashboard']

export default function RootLayout() {
  const { pathname } = useLocation()
  const showHeader = !noHeaderRoutes.includes(pathname)

  return (
    <>
      {showHeader && <MainHeader />}
      <main className={showHeader ? 'pt-16 md:pt-[81px]' : undefined}>
        <Outlet />
      </main>
    </>
  )
}
