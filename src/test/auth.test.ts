import { describe, it, expect, beforeEach } from 'vitest'
import { loginApi, logoutApi } from '../api/auth'

beforeEach(() => {
  window.sessionStorage.clear()
})

describe('loginApi', () => {
  it('returns a session token on valid credentials', async () => {
    const response = await loginApi({ email: 'john@example.com', password: 'password123' })
    expect(response.success).toBe(true)
    expect(response.data).not.toBeNull()
    expect(response.data?.token).toBeTruthy()
    expect(response.data?.user.email).toBe('john@example.com')
    expect(response.error).toBeNull()
  })

  it('does not expose password in session user object', async () => {
    const response = await loginApi({ email: 'john@example.com', password: 'password123' })
    expect(response.success).toBe(true)
    expect((response.data?.user as Record<string, unknown>)?.password).toBeUndefined()
  })

  it('returns error for invalid email', async () => {
    const response = await loginApi({ email: 'wrong@example.com', password: 'password123' })
    expect(response.success).toBe(false)
    expect(response.data).toBeNull()
    expect(response.error).toBeTruthy()
  })

  it('returns error for invalid password', async () => {
    const response = await loginApi({ email: 'john@example.com', password: 'wrongpassword' })
    expect(response.success).toBe(false)
    expect(response.data).toBeNull()
  })

  it('stores session in sessionStorage after login', async () => {
    await loginApi({ email: 'john@example.com', password: 'password123' })
    const stored = window.sessionStorage.getItem('ticktock_session')
    expect(stored).not.toBeNull()
  })
})

describe('logoutApi', () => {
  it('clears session from sessionStorage', async () => {
    await loginApi({ email: 'john@example.com', password: 'password123' })
    await logoutApi()
    const stored = window.sessionStorage.getItem('ticktock_session')
    expect(stored).toBeNull()
  })

  it('returns success true', async () => {
    const response = await logoutApi()
    expect(response.success).toBe(true)
  })
})
