import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TimesheetFilters, TimesheetStatus } from '../../types'

interface FiltersBarProps {
  onFilterChange: (filters: TimesheetFilters) => void
}

const STATUS_OPTIONS: { value: TimesheetStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'missing', label: 'Missing' },
]

export function FiltersBar({ onFilterChange }: FiltersBarProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<TimesheetStatus | ''>('')
  const [dateDropdown, setDateDropdown] = useState(false)
  const [statusDropdown, setStatusDropdown] = useState(false)

  const applyDateRange = () => {
    setDateDropdown(false)
    onFilterChange({ startDate: startDate || undefined, endDate: endDate || undefined, status: status || undefined })
  }

  const clearDateRange = () => {
    setStartDate('')
    setEndDate('')
    setDateDropdown(false)
    onFilterChange({ status: status || undefined })
  }

  const handleStatusChange = (val: TimesheetStatus | '') => {
    setStatus(val)
    setStatusDropdown(false)
    onFilterChange({ startDate: startDate || undefined, endDate: endDate || undefined, status: val || undefined })
  }

  const dateLabel =
    startDate && endDate
      ? `${startDate} → ${endDate}`
      : startDate
      ? `From ${startDate}`
      : 'Date Range'

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => { setDateDropdown((p) => !p); setStatusDropdown(false) }}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {dateLabel}
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {dateDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDateDropdown(false)} />
            <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-lg">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Date Range</p>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-600">End date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={applyDateRange}
                  className="flex-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearDateRange}
                  className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => { setStatusDropdown((p) => !p); setDateDropdown(false) }}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {STATUS_OPTIONS.find((o) => o.value === status)?.label || 'Status'}
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {statusDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(false)} />
            <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    status === opt.value ? 'font-medium text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
