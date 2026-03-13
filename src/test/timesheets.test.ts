import { describe, it, expect, beforeEach } from 'vitest'
import { loginApi } from '../api/auth'
import { getTimesheetsApi, getTimesheetByIdApi, createEntryApi, deleteEntryApi } from '../api/timesheets'

async function setupAuth() {
  await loginApi({ email: 'john@example.com', password: 'password123' })
}

beforeEach(async () => {
  window.sessionStorage.clear()
})

describe('getTimesheetsApi', () => {
  it('returns error when not authenticated', async () => {
    const response = await getTimesheetsApi()
    expect(response.success).toBe(false)
    expect(response.error).toBe('Unauthorized')
  })

  it('returns timesheets when authenticated', async () => {
    await setupAuth()
    const response = await getTimesheetsApi()
    expect(response.success).toBe(true)
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data!.length).toBeGreaterThan(0)
  })

  it('filters by status correctly', async () => {
    await setupAuth()
    const response = await getTimesheetsApi({ status: 'completed' })
    expect(response.success).toBe(true)
    response.data!.forEach((ts) => expect(ts.status).toBe('completed'))
  })

  it('filters by date range and includes overlapping weeks', async () => {
    await setupAuth()
    const response = await getTimesheetsApi({ startDate: '2024-01-01', endDate: '2024-01-12' })
    expect(response.success).toBe(true)
    expect(response.data!.length).toBe(2)
  })

  it('returns empty array when no weeks match filter', async () => {
    await setupAuth()
    const response = await getTimesheetsApi({ startDate: '2025-01-01', endDate: '2025-01-07' })
    expect(response.success).toBe(true)
    expect(response.data!.length).toBe(0)
  })
})

describe('getTimesheetByIdApi', () => {
  it('returns a timesheet by id', async () => {
    await setupAuth()
    const response = await getTimesheetByIdApi('week-1')
    expect(response.success).toBe(true)
    expect(response.data?.id).toBe('week-1')
  })

  it('returns error for unknown id', async () => {
    await setupAuth()
    const response = await getTimesheetByIdApi('nonexistent')
    expect(response.success).toBe(false)
    expect(response.error).toBeTruthy()
  })
})

describe('createEntryApi', () => {
  it('adds an entry and updates totalHours', async () => {
    await setupAuth()
    const before = await getTimesheetByIdApi('week-5')
    expect(before.data?.totalHours).toBe(0)

    await createEntryApi('week-5', {
      project: 'Homepage Development',
      typeOfWork: 'Feature Development',
      description: 'Built the header',
      hours: 4,
    })

    const after = await getTimesheetByIdApi('week-5')
    expect(after.data?.totalHours).toBe(4)
    expect(after.data?.status).toBe('incomplete')
  })

  it('marks timesheet as completed when 40 hours reached', async () => {
    await setupAuth()
    await createEntryApi('week-8', {
      project: 'API Integration',
      typeOfWork: 'Feature Development',
      description: 'Full week work',
      hours: 40,
    })
    const ts = await getTimesheetByIdApi('week-8')
    expect(ts.data?.status).toBe('completed')
  })
})

describe('deleteEntryApi', () => {
  it('removes an entry from timesheet entries', async () => {
    await setupAuth()
    const ts = await getTimesheetByIdApi('week-1')
    const entryId = ts.data!.entries[0].id

    await deleteEntryApi('week-1', entryId)

    const updated = await getTimesheetByIdApi('week-1')
    const found = updated.data!.entries.find((e) => e.id === entryId)
    expect(found).toBeUndefined()
  })
})
