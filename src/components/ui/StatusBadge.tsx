import type { TimesheetStatus } from '../../types'

interface StatusBadgeProps {
  status: TimesheetStatus
}

const config: Record<TimesheetStatus, { label: string; className: string }> = {
  completed: {
    label: 'COMPLETED',
    className: 'bg-[#DEF7EC] text-[#03543F]',
  },
  incomplete: {
    label: 'INCOMPLETE',
    className: 'bg-[#FDF6B2] text-[#723B13] border',
  },
  missing: {
    label: 'MISSING',
  className: 'bg-[#FCE8F3] text-[#99154B]',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] font-medium tracking-wide ${className}`}>
      {label}
    </span>
  )
}
