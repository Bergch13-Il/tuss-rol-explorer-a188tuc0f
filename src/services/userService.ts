import { supabase } from '@/lib/supabase/client'
import { User, AppUserDB } from '@/lib/types'

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return (data as AppUserDB[]).map((u) => ({
      id: u.id,
      username: u.login,
      password: u.password, // Exposed as per requirement
      role: u.is_admin ? 'admin' : 'user',
      createdAt: new Date(u.created_at).getTime(),
    }))
  },

  async createUser(username: string, pass: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('app_users')
      .insert([
        {
          login: username,
          password: pass,
          is_admin: false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw error
    }

    if (!data) return null

    const u = data as AppUserDB
    return {
      id: u.id,
      username: u.login,
      password: u.password,
      role: u.is_admin ? 'admin' : 'user',
      createdAt: new Date(u.created_at).getTime(),
    }
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('app_users').delete().eq('id', id)
    if (error) throw error
  },

  async verifyCredentials(
    username: string,
    pass: string,
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('login', username)
      .eq('password', pass)
      .single()

    if (error || !data) {
      return null
    }

    const u = data as AppUserDB
    return {
      id: u.id,
      username: u.login,
      password: u.password,
      role: u.is_admin ? 'admin' : 'user',
      createdAt: new Date(u.created_at).getTime(),
    }
  },
}
