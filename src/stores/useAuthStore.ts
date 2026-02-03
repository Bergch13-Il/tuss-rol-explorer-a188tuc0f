import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/lib/types'
import { toast } from 'sonner'
import { userService } from '@/services/userService'

interface AuthState {
  isAuthenticated: boolean
  currentUser: User | null
  users: User[]
  login: (username: string, pass: string) => Promise<boolean>
  logout: () => void
  registerUser: (username: string, pass: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  loadUsers: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      users: [],

      login: async (username, pass) => {
        try {
          const user = await userService.verifyCredentials(username, pass)
          if (user) {
            set({ isAuthenticated: true, currentUser: user })
            toast.success(`Bem-vindo, ${username}!`)
            return true
          }
        } catch (error) {
          console.error('Login error:', error)
        }

        toast.error('Credenciais inválidas.')
        return false
      },

      logout: () => {
        set({ isAuthenticated: false, currentUser: null, users: [] })
        toast.info('Sessão encerrada.')
      },

      registerUser: async (username, pass) => {
        try {
          // Check locally first to avoid unnecessary calls if loaded, but DB check is safer
          // We'll rely on DB unique constraint error or check manually
          const newUser = await userService.createUser(username, pass)
          if (newUser) {
            set((state) => ({ users: [...state.users, newUser] }))
            toast.success(`Usuário ${username} cadastrado com sucesso.`)
          }
        } catch (error: any) {
          if (error.code === '23505') {
            toast.error('Nome de usuário já existe.')
          } else {
            toast.error('Erro ao cadastrar usuário.')
            console.error(error)
          }
        }
      },

      deleteUser: async (id) => {
        try {
          await userService.deleteUser(id)
          set((state) => ({ users: state.users.filter((u) => u.id !== id) }))
          toast.success('Usuário removido.')
        } catch (error) {
          toast.error('Erro ao remover usuário.')
          console.error(error)
        }
      },

      loadUsers: async () => {
        try {
          const users = await userService.getUsers()
          set({ users })
        } catch (error) {
          console.error('Failed to load users', error)
        }
      },
    }),
    {
      name: 'tuss-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }), // Only persist session
    },
  ),
)
