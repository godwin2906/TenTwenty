import type { AuthSession } from '../types'

const SESSION_KEY = 'ticktock_session'

export const sessionStorage = {
  get(): AuthSession | null {
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const session: AuthSession = JSON.parse(raw)
      if (Date.now() > session.expiresAt) {
        this.clear()
        return null
      }
      return session
    } catch {
      return null
    }
  },

  set(session: AuthSession): void {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  },

  clear(): void {
    window.sessionStorage.removeItem(SESSION_KEY)
  },

  isValid(): boolean {
    return this.get() !== null
  },
}
