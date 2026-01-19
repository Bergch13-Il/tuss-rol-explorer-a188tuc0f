import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/types'
import { toast } from 'sonner'

interface AuthState {
  isAuthenticated: boolean
  currentUser: User | null
  users: User[]
  login: (username: string, pass: string) => boolean
  logout: () => void
  registerUser: (username: string, pass: string) => void
  deleteUser: (id: string) => void
}

const ADMIN_USER: User = {
  id: 'admin-001',
  username: 'Berg',
  role: 'admin',
  createdAt: Date.now(),
}

const ADMIN_PASS = 'c1c3r@1302'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      users: [],

      login: (username, pass) => {
        // Check Admin
        if (username === ADMIN_USER.username && pass === ADMIN_PASS) {
          set({ isAuthenticated: true, currentUser: ADMIN_USER })
          toast.success('Login de Administrador realizado com sucesso!')
          return true
        }

        // Check Regular Users
        const foundUser = get().users.find(
          (u) => u.username === username && u.password === pass,
        )

        if (foundUser) {
          // Remove password from state for safety (mock)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...safeUser } = foundUser
          set({ isAuthenticated: true, currentUser: safeUser as User })
          toast.success(`Bem-vindo, ${username}!`)
          return true
        }

        toast.error('Credenciais inválidas.')
        return false
      },

      logout: () => {
        set({ isAuthenticated: false, currentUser: null })
        toast.info('Sessão encerrada.')
      },

      registerUser: (username, pass) => {
        const users = get().users
        if (
          users.some((u) => u.username === username) ||
          username === ADMIN_USER.username
        ) {
          toast.error('Nome de usuário já existe.')
          return
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          username,
          password: pass,
          role: 'user',
          createdAt: Date.now(),
        }

        set({ users: [...users, newUser] })
        toast.success(`Usuário ${username} cadastrado com sucesso.`)
      },

      deleteUser: (id) => {
        const users = get().users.filter((u) => u.id !== id)
        set({ users })
        toast.success('Usuário removido.')
      },
    }),
    {
      name: 'tuss-auth-storage',
      partialize: (state) => ({ users: state.users }), // Persist only users list, session is transient (or you can persist auth too if desired)
    },
  ),
)
