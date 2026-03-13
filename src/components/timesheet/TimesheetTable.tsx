import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { format, parseISO } from 'date-fns'
import type { Timesheet, TimesheetStatus } from '../../types'

interface TimesheetTableProps {
  timesheets: Timesheet[]
}

type SortKey = 'weekNumber' | 'startDate' | 'status'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

function formatDateRange(start: string, end: string): string {
  const s = parseISO(start)
  const e = parseISO(end)
  const sDay = format(s, 'd')
  const eDay = format(e, 'd')
  const month = format(s, 'MMMM, yyyy')
  return `${sDay} - ${eDay} ${month}`
}

function SortIcon({ field, sortKey, sortDir }: { field: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (field !== sortKey) return <ChevronsUpDown size={12} className="text-gray-400" />
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-blue-600" />
    : <ChevronDown size={12} className="text-blue-600" />
}

export function TimesheetTable({ timesheets }: TimesheetTableProps) {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('weekNumber')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = [...timesheets].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'weekNumber') cmp = a.weekNumber - b.weekNumber
    if (sortKey === 'startDate') cmp = a.startDate.localeCompare(b.startDate)
    if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const getActionLabel = (status: TimesheetStatus) => {
    if (status === 'completed') return { label: 'View', className: 'text-blue-600 hover:text-blue-800' }
    if (status === 'incomplete') return { label: 'Update', className: 'text-blue-600 hover:text-blue-800' }
    return { label: 'Create', className: 'text-blue-600 hover:text-blue-800' }
  }

  const pageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const SortHeader = ({ field, label }: { field: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700 transition-colors"
    >
      {label}
      <SortIcon field={field} sortKey={sortKey} sortDir={sortDir} />
    </button>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left">
                <SortHeader field="weekNumber" label="Week #" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortHeader field="startDate" label="Date" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortHeader field="status" label="Status" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                  No timesheets found for the selected filters.
                </td>
              </tr>
            ) : (
              paginated.map((ts) => {
                const action = getActionLabel(ts.status)
                return (
                  <tr key={ts.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{ts.weekNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDateRange(ts.startDate, ts.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ts.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/dashboard/${ts.id}`)}
                        className={`text-sm font-medium transition-colors ${action.className}`}
                      >
                        {action.label}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          {pageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`min-w-[32px] rounded px-2 py-1.5 text-sm transition-colors ${
                  page === p
                    ? 'bg-blue-600 font-medium text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
