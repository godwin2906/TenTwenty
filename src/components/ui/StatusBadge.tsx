import type { TimesheetStatus } from '../../types'

interface StatusBadgeProps {
  status: TimesheetStatus
}

const config: Record<TimesheetStatus, { label: string; className: string }> = {
  completed: {
    label: 'COMPLETED',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  incomplete: {
    label: 'INCOMPLETE',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  missing: {
    label: 'MISSING',
    className: 'bg-red-100 text-red-600 border border-red-200',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${className}`}>
      {label}
    </span>
  )
}
