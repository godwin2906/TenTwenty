import { MOCK_TIMESHEETS, MOCK_PROJECTS, MOCK_WORK_TYPES } from '../mocks/data'
import { sessionStorage } from '../lib/session'
import type { Timesheet, TimesheetEntry, TimesheetFilters, EntryFormData, ApiResponse, TimesheetStatus } from '../types'

let timesheets: Timesheet[] = [...MOCK_TIMESHEETS]

function requireAuth(): string {
  const session = sessionStorage.get()
  if (!session) throw new Error('Unauthorized')
  return session.token
}

function computeStatus(totalHours: number): TimesheetStatus {
  if (totalHours === 0) return 'missing'
  if (totalHours >= 40) return 'completed'
  return 'incomplete'
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export async function getTimesheetsApi(filters?: TimesheetFilters): Promise<ApiResponse<Timesheet[]>> {
  await new Promise((r) => setTimeout(r, 400))

  try {
    requireAuth()
    let result = [...timesheets]

    if (filters?.startDate && filters?.endDate) {
      const start = parseDate(filters.startDate)
      const end = parseDate(filters.endDate)
      result = result.filter((ts) => {
        const tsStart = parseDate(ts.startDate)
        const tsEnd = parseDate(ts.endDate)
        return tsStart <= end && tsEnd >= start
      })
    }

    if (filters?.status) {
      result = result.filter((ts) => ts.status === filters.status)
    }

    return { data: result, error: null, success: true }
  } catch (err) {
    return { data: null, error: (err as Error).message, success: false }
  }
}

export async function getTimesheetByIdApi(id: string): Promise<ApiResponse<Timesheet>> {
  await new Promise((r) => setTimeout(r, 300))

  try {
    requireAuth()
    const ts = timesheets.find((t) => t.id === id)
    if (!ts) return { data: null, error: 'Timesheet not found', success: false }
    return { data: ts, error: null, success: true }
  } catch (err) {
    return { data: null, error: (err as Error).message, success: false }
  }
}

export async function createEntryApi(weekId: string, formData: EntryFormData): Promise<ApiResponse<TimesheetEntry>> {
  await new Promise((r) => setTimeout(r, 400))

  try {
    requireAuth()
    const tsIndex = timesheets.findIndex((t) => t.id === weekId)
    if (tsIndex === -1) return { data: null, error: 'Timesheet week not found', success: false }

    const ts = timesheets[tsIndex]
    const weekDates = getWeekDates(ts.startDate, ts.endDate)
    const entryDate = weekDates[0]

    const newEntry: TimesheetEntry = {
      id: `entry-${weekId}-${Date.now()}`,
      weekId,
      date: entryDate,
      project: formData.project,
      typeOfWork: formData.typeOfWork,
      description: formData.description,
      hours: formData.hours,
    }

    const newTotalHours = ts.totalHours + formData.hours
    timesheets[tsIndex] = {
      ...ts,
      entries: [...ts.entries, newEntry],
      totalHours: newTotalHours,
      status: computeStatus(newTotalHours),
    }

    return { data: newEntry, error: null, success: true }
  } catch (err) {
    return { data: null, error: (err as Error).message, success: false }
  }
}

export async function updateEntryApi(weekId: string, entryId: string, formData: EntryFormData): Promise<ApiResponse<TimesheetEntry>> {
  await new Promise((r) => setTimeout(r, 400))

  try {
    requireAuth()
    const tsIndex = timesheets.findIndex((t) => t.id === weekId)
    if (tsIndex === -1) return { data: null, error: 'Timesheet week not found', success: false }

    const ts = timesheets[tsIndex]
    const entryIndex = ts.entries.findIndex((e) => e.id === entryId)
    if (entryIndex === -1) return { data: null, error: 'Entry not found', success: false }

    const updatedEntry: TimesheetEntry = {
      ...ts.entries[entryIndex],
      project: formData.project,
      typeOfWork: formData.typeOfWork,
      description: formData.description,
      hours: formData.hours,
    }

    const updatedEntries = ts.entries.map((e) => (e.id === entryId ? updatedEntry : e))
    const newTotalHours = updatedEntries.reduce((sum, e) => sum + e.hours, 0)

    timesheets[tsIndex] = {
      ...ts,
      entries: updatedEntries,
      totalHours: newTotalHours,
      status: computeStatus(newTotalHours),
    }

    return { data: updatedEntry, error: null, success: true }
  } catch (err) {
    return { data: null, error: (err as Error).message, success: false }
  }
}

export async function deleteEntryApi(weekId: string, entryId: string): Promise<ApiResponse<null>> {
  await new Promise((r) => setTimeout(r, 300))

  try {
    requireAuth()
    const tsIndex = timesheets.findIndex((t) => t.id === weekId)
    if (tsIndex === -1) return { data: null, error: 'Timesheet not found', success: false }

    const ts = timesheets[tsIndex]
    const updatedEntries = ts.entries.filter((e) => e.id !== entryId)
    const newTotalHours = updatedEntries.reduce((sum, e) => sum + e.hours, 0)

    timesheets[tsIndex] = {
      ...ts,
      entries: updatedEntries,
      totalHours: newTotalHours,
      status: computeStatus(newTotalHours),
    }

    return { data: null, error: null, success: true }
  } catch (err) {
    return { data: null, error: (err as Error).message, success: false }
  }
}

export function getProjectsApi(): string[] {
  return MOCK_PROJECTS
}

export function getWorkTypesApi(): string[] {
  return MOCK_WORK_TYPES
}

function getWeekDates(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export { getWeekDates }
