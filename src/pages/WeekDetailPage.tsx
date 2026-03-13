import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { WeekDetailView } from '../components/timesheet/WeekDetailView'
import { useTimesheetDetail } from '../hooks/useTimesheets'

export function WeekDetailPage() {
  const { weekId } = useParams<{ weekId: string }>()
  const navigate = useNavigate()
  const { timesheet, isLoading, error, fetchTimesheet, addEntry, editEntry, removeEntry } =
    useTimesheetDetail(weekId!)

  useEffect(() => {
    if (weekId) fetchTimesheet()
  }, [weekId, fetchTimesheet])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to timesheets
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-32">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => fetchTimesheet()}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : timesheet ? (
          <>
            <WeekDetailView
              timesheet={timesheet}
              onAddEntry={addEntry}
              onEditEntry={editEntry}
              onDeleteEntry={removeEntry}
            />
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">© 2024 tentwenty. All rights reserved.</p>
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}
