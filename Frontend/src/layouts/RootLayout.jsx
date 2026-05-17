import { Outlet } from 'react-router-dom'
import MainHeader from './MainHeader'

export default function RootLayout() {
  return (
    <>
      <MainHeader />
      <main className="pt-16 md:pt-[81px]">
        <Outlet />
      </main>
    </>
  )
}
