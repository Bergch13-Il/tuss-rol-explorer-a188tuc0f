import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { DataProvider } from '@/stores/useDataStore'
import { SettingsProvider } from '@/stores/useSettingsStore'

export default function Layout() {
  return (
    <SettingsProvider>
      <DataProvider>
        <main className="flex flex-col min-h-screen bg-background">
          <Header />
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </DataProvider>
    </SettingsProvider>
  )
}
