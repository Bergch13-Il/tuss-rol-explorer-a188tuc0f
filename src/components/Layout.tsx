import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { DataProvider } from '@/stores/useDataStore'
import { SettingsProvider } from '@/stores/useSettingsStore'

export default function Layout() {
  return (
    <SettingsProvider>
      <DataProvider>
        <main className="flex flex-col min-h-screen bg-background">
          <Header />
          <div className="flex-1 w-full">
            <Outlet />
          </div>
        </main>
      </DataProvider>
    </SettingsProvider>
  )
}
