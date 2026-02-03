import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { RemoveBadge } from '@/components/RemoveBadge'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <TooltipProvider>
      <RemoveBadge />
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes for All Users */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<ChatPage />} />

            {/* Protected Routes for Admin Only */}
            <Route element={<RequireAuth allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Redirect old connection route to admin if admin, or home if user */}
            <Route
              path="/connection"
              element={<Navigate to="/admin" replace />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
