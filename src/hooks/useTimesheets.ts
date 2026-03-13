import { useState, useCallback } from 'react'
import {
  getTimesheetsApi,
  getTimesheetByIdApi,
  createEntryApi,
  updateEntryApi,
  deleteEntryApi,
} from '../api/timesheets'
import type { Timesheet, TimesheetEntry, TimesheetFilters, EntryFormData } from '../types'

export function useTimesheets() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimesheets = useCallback(async (filters?: TimesheetFilters) => {
    setIsLoading(true)
    setError(null)
    const response = await getTimesheetsApi(filters)
    if (response.success && response.data) {
      setTimesheets(response.data)
    } else {
      setError(response.error)
    }
    setIsLoading(false)
  }, [])

  return { timesheets, isLoading, error, fetchTimesheets }
}

export function useTimesheetDetail(weekId: string) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimesheet = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await getTimesheetByIdApi(weekId)
    if (response.success && response.data) {
      setTimesheet(response.data)
    } else {
      setError(response.error)
    }
    setIsLoading(false)
  }, [weekId])

  const addEntry = async (formData: EntryFormData): Promise<TimesheetEntry | null> => {
    const response = await createEntryApi(weekId, formData)
    if (response.success && response.data) {
      await fetchTimesheet()
      return response.data
    }
    return null
  }

  const editEntry = async (entryId: string, formData: EntryFormData): Promise<boolean> => {
    const response = await updateEntryApi(weekId, entryId, formData)
    if (response.success) {
      await fetchTimesheet()
      return true
    }
    return false
  }

  const removeEntry = async (entryId: string): Promise<boolean> => {
    const response = await deleteEntryApi(weekId, entryId)
    if (response.success) {
      await fetchTimesheet()
      return true
    }
    return false
  }

  return { timesheet, isLoading, error, fetchTimesheet, addEntry, editEntry, removeEntry }
}
