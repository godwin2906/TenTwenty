export type TimesheetStatus = 'completed' | 'incomplete' | 'missing'

export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
}

export interface TimesheetEntry {
  id: string
  weekId: string
  date: string
  project: string
  typeOfWork: string
  description: string
  hours: number
}

export interface Timesheet {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  status: TimesheetStatus
  totalHours: number
  entries: TimesheetEntry[]
}

export interface AuthSession {
  token: string
  user: Omit<User, 'password'>
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface TimesheetFilters {
  startDate?: string
  endDate?: string
  status?: TimesheetStatus | ''
}

export interface EntryFormData {
  project: string
  typeOfWork: string
  description: string
  hours: number
}
