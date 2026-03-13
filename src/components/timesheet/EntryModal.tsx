import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Info, Minus, Plus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getProjectsApi, getWorkTypesApi } from '../../api/timesheets'
import type { EntryFormData, TimesheetEntry } from '../../types'

const schema = z.object({
  project: z.string().min(1, 'Project is required'),
  typeOfWork: z.string().min(1, 'Type of work is required'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  hours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours'),
})

interface EntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EntryFormData) => Promise<void>
  editEntry?: TimesheetEntry | null
  isSubmitting: boolean
}

export function EntryModal({ isOpen, onClose, onSubmit, editEntry, isSubmitting }: EntryModalProps) {
  const projects = getProjectsApi().map((p) => ({ value: p, label: p }))
  const workTypes = getWorkTypesApi().map((t) => ({ value: t, label: t }))

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(schema),
    defaultValues: { project: '', typeOfWork: 'Bug fixes', description: '', hours: 1 },
  })

  const hours = watch('hours')

  useEffect(() => {
    if (editEntry) {
      reset({
        project: editEntry.project,
        typeOfWork: editEntry.typeOfWork,
        description: editEntry.description,
        hours: editEntry.hours,
      })
    } else {
      reset({ project: '', typeOfWork: 'Bug fixes', description: '', hours: 1 })
    }
  }, [editEntry, isOpen, reset])

  const changeHours = (delta: number) => {
    const next = Math.max(0.5, Math.min(24, hours + delta))
    setValue('hours', next, { shouldValidate: true })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editEntry ? 'Edit Entry' : 'Add New Entry'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Select Project <span className="text-red-500">*</span>
            <Info size={12} className="text-gray-400" />
          </label>
          <select
            {...register('project')}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.project ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">Project Name</option>
            {projects.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {errors.project && <p className="text-xs text-red-500">{errors.project.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Type of Work <span className="text-red-500">*</span>
            <Info size={12} className="text-gray-400" />
          </label>
          <select
            {...register('typeOfWork')}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.typeOfWork ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            {workTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.typeOfWork && <p className="text-xs text-red-500">{errors.typeOfWork.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Task description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Write text here ..."
            className={`w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-400">A note for extra info</p>
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Hours <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeHours(-0.5)}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-10 text-center text-sm font-medium">{hours}</span>
            <button
              type="button"
              onClick={() => changeHours(0.5)}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          {errors.hours && <p className="text-xs text-red-500">{errors.hours.message}</p>}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {editEntry ? 'Update entry' : 'Add entry'}
          </Button>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
