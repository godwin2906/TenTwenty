import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import type { LoginCredentials } from '../types'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    setApiError('')
    const response = await login(data)
    if (response.success) {
      navigate('/dashboard')
    } else {
      setApiError(response.error || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col justify-center px-10 sm:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`w-full rounded-md border px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••"
                {...register('password')}
                className={`w-full rounded-md border px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {apiError && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            Demo: <span className="font-medium text-gray-600">john@example.com</span> / <span className="font-medium text-gray-600">password123</span>
          </p>
        </div>
      </div>

      <div className="hidden sm:flex sm:w-1/2 flex-col items-start justify-end bg-blue-600 p-16">
        <div>
          <h2 className="mb-4 text-4xl font-bold text-white">ticktock</h2>
          <p className="max-w-sm text-sm leading-relaxed text-blue-100">
            Introducing ticktock, our cutting-edge timesheet web application designed to
            revolutionize how you manage employee work hours. With ticktock, you can
            effortlessly track and monitor employee attendance and productivity from anywhere,
            anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  )
}
