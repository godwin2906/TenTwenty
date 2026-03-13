import type { User, Timesheet, TimesheetEntry } from '../types'

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'JD',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'JS',
  },
]

export const MOCK_PROJECTS = [
  'Homepage Development',
  'API Integration',
  'Dashboard Redesign',
  'Mobile App',
  'Backend Services',
  'QA & Testing',
]

export const MOCK_WORK_TYPES = [
  'Bug fixes',
  'Feature Development',
  'Code Review',
  'Documentation',
  'Meetings',
  'Research',
]

const makeEntries = (weekId: string, dates: string[], hoursPerDay: number[]): TimesheetEntry[] =>
  dates.flatMap((date, di) =>
    hoursPerDay[di] > 0
      ? [
          {
            id: `entry-${weekId}-${di}-1`,
            weekId,
            date,
            project: MOCK_PROJECTS[di % MOCK_PROJECTS.length],
            typeOfWork: MOCK_WORK_TYPES[di % MOCK_WORK_TYPES.length],
            description: 'Homepage Development',
            hours: Math.min(hoursPerDay[di], 4),
          },
          ...(hoursPerDay[di] > 4
            ? [
                {
                  id: `entry-${weekId}-${di}-2`,
                  weekId,
                  date,
                  project: MOCK_PROJECTS[(di + 1) % MOCK_PROJECTS.length],
                  typeOfWork: MOCK_WORK_TYPES[(di + 1) % MOCK_WORK_TYPES.length],
                  description: 'Homepage Development',
                  hours: hoursPerDay[di] - 4,
                },
              ]
            : []),
        ]
      : []
  )

export const MOCK_TIMESHEETS: Timesheet[] = [
  {
    id: 'week-1',
    weekNumber: 1,
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    status: 'completed',
    totalHours: 40,
    entries: makeEntries(
      'week-1',
      ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
      [8, 8, 8, 8, 8]
    ),
  },
  {
    id: 'week-2',
    weekNumber: 2,
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    status: 'completed',
    totalHours: 40,
    entries: makeEntries(
      'week-2',
      ['2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12'],
      [8, 8, 8, 8, 8]
    ),
  },
  {
    id: 'week-3',
    weekNumber: 3,
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    status: 'incomplete',
    totalHours: 20,
    entries: makeEntries(
      'week-3',
      ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'],
      [4, 4, 4, 4, 4]
    ),
  },
  {
    id: 'week-4',
    weekNumber: 4,
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    status: 'completed',
    totalHours: 40,
    entries: makeEntries(
      'week-4',
      ['2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26'],
      [8, 8, 8, 8, 8]
    ),
  },
  {
    id: 'week-5',
    weekNumber: 5,
    startDate: '2024-01-29',
    endDate: '2024-02-02',
    status: 'missing',
    totalHours: 0,
    entries: [],
  },
  {
    id: 'week-6',
    weekNumber: 6,
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    status: 'completed',
    totalHours: 40,
    entries: makeEntries(
      'week-6',
      ['2024-02-05', '2024-02-06', '2024-02-07', '2024-02-08', '2024-02-09'],
      [8, 8, 8, 8, 8]
    ),
  },
  {
    id: 'week-7',
    weekNumber: 7,
    startDate: '2024-02-12',
    endDate: '2024-02-16',
    status: 'incomplete',
    totalHours: 32,
    entries: makeEntries(
      'week-7',
      ['2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16'],
      [8, 8, 8, 8, 0]
    ),
  },
  {
    id: 'week-8',
    weekNumber: 8,
    startDate: '2024-02-19',
    endDate: '2024-02-23',
    status: 'missing',
    totalHours: 0,
    entries: [],
  },
  {
    id: 'week-9',
    weekNumber: 9,
    startDate: '2024-02-26',
    endDate: '2024-03-01',
    status: 'completed',
    totalHours: 40,
    entries: makeEntries(
      'week-9',
      ['2024-02-26', '2024-02-27', '2024-02-28', '2024-02-29', '2024-03-01'],
      [8, 8, 8, 8, 8]
    ),
  },
  {
    id: 'week-10',
    weekNumber: 10,
    startDate: '2024-03-04',
    endDate: '2024-03-08',
    status: 'incomplete',
    totalHours: 16,
    entries: makeEntries(
      'week-10',
      ['2024-03-04', '2024-03-05', '2024-03-06', '2024-03-07', '2024-03-08'],
      [8, 8, 0, 0, 0]
    ),
  },
]
