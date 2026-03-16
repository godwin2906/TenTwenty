import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Plus, MoreHorizontal, Ellipsis } from 'lucide-react'
import { EntryModal } from './EntryModal'
import type { Timesheet, TimesheetEntry, EntryFormData } from '../../types'

interface WeekDetailViewProps {
  timesheet: Timesheet
  onAddEntry: (data: EntryFormData) => Promise<TimesheetEntry | null>
  onEditEntry: (entryId: string, data: EntryFormData) => Promise<boolean>
  onDeleteEntry: (entryId: string) => Promise<boolean>
}

interface GroupedEntries {
  date: string
  entries: TimesheetEntry[]
}

function groupEntriesByDate(entries: TimesheetEntry[]): GroupedEntries[] {
  const map = new Map<string, TimesheetEntry[]>()
  entries.forEach((e) => {
    if (!map.has(e.date)) map.set(e.date, [])
    map.get(e.date)!.push(e)
  })
  return Array.from(map.entries())
    .map(([date, entries]) => ({ date, entries }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function getWeekDates(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const current = new Date(start)
  while (current <= end) {
    dates.push(format(current, 'yyyy-MM-dd'))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function WeekDetailView({ timesheet, onAddEntry, onEditEntry, onDeleteEntry }: WeekDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<TimesheetEntry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [_activeDate, setActiveDate] = useState<string | null>(null)

  const grouped = groupEntriesByDate(timesheet.entries)
  const allWeekDates = getWeekDates(timesheet.startDate, timesheet.endDate)
  const datesWithEntries = new Set(grouped.map((g) => g.date))

  const emptyDates = allWeekDates.filter((d) => !datesWithEntries.has(d))

  const progressPercent = Math.min(100, (timesheet.totalHours / 40) * 100)

  const handleOpenAdd = (date?: string) => {
    setEditEntry(null)
    setActiveDate(date || null)
    setModalOpen(true)
  }

  const handleOpenEdit = (entry: TimesheetEntry) => {
    setEditEntry(entry)
    setActiveDate(entry.date)
    setOpenMenuId(null)
    setModalOpen(true)
  }

  const handleSubmit = async (data: EntryFormData) => {
    setIsSubmitting(true)
    if (editEntry) {
      await onEditEntry(editEntry.id, data)
    } else {
      await onAddEntry(data)
    }
    setIsSubmitting(false)
    setModalOpen(false)
  }

  const handleDelete = async (entryId: string) => {
    setOpenMenuId(null)
    await onDeleteEntry(entryId)
  }

  return (
    <div className="rounded-lg shadow-sm  bg-white">
      <div className=" px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111928]">This week's timesheet</h2>
            <p className="text-sm text-[#6B7280] mt-5">
              {format(parseISO(timesheet.startDate), 'd')} -{' '}
              {format(parseISO(timesheet.endDate), 'd MMMM, yyyy')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-[#111928] bg-[#FFFFFF] shadow-sm ">
              <span className="text-[#111928]">{timesheet.totalHours}</span>/40 hrs
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {grouped.map(({ date, entries }) => (
          <div key={date} className="px-6 py-3 flex gap-11 justify-between">
            <p className="mb-2 text-sm font-semibold text-[#111928]">
              {format(parseISO(date), 'MMM d')}
            </p>
            <div className="flex flex-col gap-1 w-[92%]">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded px-3 py-2 text-sm border border-[#E5E7EB]"
                >
                  <span className="flex-1 text-[#111928]">{entry.description}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#9CA3AF]">{entry.hours} hrs</span>
                    <span className="rounded-[20px] bg-[#E1EFFE] px-2 py-0.5 text-xs font-medium text-[#1E429F]">
                      {entry.project}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                        className="transition-colors"
                      >
                       <Ellipsis color="#6B7280" />
                      </button>
                      {openMenuId === entry.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full z-20 mt-1 w-28 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                            <button
                              onClick={() => handleOpenEdit(entry)}
                              className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleOpenAdd(date)}
                 className="flex items-center justify-center text-center gap-1 rounded border border-dashed border-[#D1D5DB] px-3 py-2 text-sm text-[#6B7280] hover:text-[#1A56DB] hover:border-[#1A56DB] hover:bg-[#E1EFFE] transition-colors w-full mt-1"
              >
                <Plus size={12} />
                Add new task
              </button>
            </div>
          </div>
        ))}

        {emptyDates.map((date) => (
          <div key={date} className="px-6 py-3">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              {format(parseISO(date), 'MMM d')}
            </p>
            <button
              onClick={() => handleOpenAdd(date)}
              className="flex items-center text-center justify-center gap-1 rounded border border-dashed border-[#D1D5DB] px-3 py-2 text-sm text-[#6B7280] hover:text-[#1A56DB] hover:border-[#1A56DB] hover:bg-[#E1EFFE] transition-colors w-full"
            >
              <Plus size={12} />
              Add new task
            </button>
          </div>
        ))}
      </div>

      <EntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editEntry={editEntry}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
