import { MOCK_USERS } from '../mocks/data'
import { sessionStorage } from '../lib/session'
import type { LoginCredentials, ApiResponse, AuthSession } from '../types'

const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000

function generateToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`)
}

export async function loginApi(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
  await new Promise((r) => setTimeout(r, 600))

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  )

  if (!user) {
    return { data: null, error: 'Invalid email or password.', success: false }
  }

  const { password: _, ...safeUser } = user
  const session: AuthSession = {
    token: generateToken(user.id),
    user: safeUser,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  }

  sessionStorage.set(session)
  return { data: session, error: null, success: true }
}

export async function logoutApi(): Promise<ApiResponse<null>> {
  await new Promise((r) => setTimeout(r, 200))
  sessionStorage.clear()
  return { data: null, error: null, success: true }
}

export function getCurrentSession(): AuthSession | null {
  return sessionStorage.get()
}
