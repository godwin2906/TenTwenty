import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loginApi, logoutApi, getCurrentSession } from '../api/auth'
import type { AuthSession, LoginCredentials, ApiResponse } from '../types'

interface AuthContextValue {
  session: AuthSession | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthSession>>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const existing = getCurrentSession()
    setSession(existing)
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> => {
    const response = await loginApi(credentials)
    if (response.success && response.data) {
      setSession(response.data)
    }
    return response
  }

  const logout = async () => {
    await logoutApi()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
