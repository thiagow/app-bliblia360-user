"use client"

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const TOTAL_PRACTICES = 7

type DayState = "future" | "empty" | "partial" | "complete" | "today-empty" | "today-partial" | "today-complete"

type Props = {
  year: number
  month: number // 1–12
  today: string // "yyyy-MM-dd"
  trackers: { date: string; practices: string[] }[]
  onDayPress: (date: string) => void
}

function getDayState(dateStr: string, today: string, practices: string[]): DayState {
  const isToday = dateStr === today
  const isFuture = dateStr > today
  const count = practices.length

  if (isFuture) return "future"
  if (count === 0) return isToday ? "today-empty" : "empty"
  if (count === TOTAL_PRACTICES) return isToday ? "today-complete" : "complete"
  return isToday ? "today-partial" : "partial"
}

function DayCell({
  dateStr,
  dayNum,
  state,
  practices,
  onPress,
}: {
  dateStr: string
  dayNum: number
  state: DayState
  practices: string[]
  onPress: (date: string) => void
}) {
  const isFuture = state === "future"
  const isToday = state.startsWith("today")
  const isComplete = state === "complete" || state === "today-complete"
  const isPartial = state === "partial" || state === "today-partial"

  const fillPercent = TOTAL_PRACTICES > 0
    ? Math.round((practices.length / TOTAL_PRACTICES) * 100)
    : 0

  return (
    <button
      onClick={() => !isFuture && onPress(dateStr)}
      disabled={isFuture}
      aria-label={`${dayNum} — ${practices.length} práticas`}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-200 min-h-[44px]
        ${isFuture ? "opacity-25 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        ${isToday ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-950" : ""}
        ${isComplete ? "bg-amber-500/20" : "bg-zinc-900/50 hover:bg-zinc-800/60"}
      `}
    >
      {/* Fill indicator for partial days */}
      {isPartial && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-amber-500/30 transition-all duration-500"
          style={{ height: `${fillPercent}%` }}
        />
      )}

      {/* Day number */}
      <span
        className={`relative z-10 text-xs font-semibold leading-none
          ${isComplete ? "text-amber-400" : isPartial ? "text-amber-300/80" : isToday ? "text-white" : "text-zinc-400"}
        `}
      >
        {dayNum}
      </span>

      {/* Status icon */}
      <span className="relative z-10 text-[10px] leading-none mt-0.5">
        {isComplete ? "⭐" : isPartial ? "◐" : isToday ? "📍" : ""}
      </span>
    </button>
  )
}

export function MonthlyCalendar({ year, month, today, trackers, onDayPress }: Props) {
  // Build tracker lookup map
  const trackMap = new Map(trackers.map((t) => [t.date, t.practices]))

  // First day of month (0 = Sunday)
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()

  // Total days in month
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  // Build grid cells (nulls for empty leading cells)
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to full weeks
  const remainder = cells.length % 7
  if (remainder !== 0) {
    cells.push(...Array(7 - remainder).fill(null))
  }

  function toDateStr(day: number) {
    const mm = String(month).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    return `${year}-${mm}-${dd}`
  }

  return (
    <div className="space-y-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-zinc-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square min-h-[44px]" />
          }

          const dateStr = toDateStr(day)
          const practices = trackMap.get(dateStr) ?? []
          const state = getDayState(dateStr, today, practices)

          return (
            <DayCell
              key={dateStr}
              dateStr={dateStr}
              dayNum={day}
              state={state}
              practices={practices}
              onPress={onDayPress}
            />
          )
        })}
      </div>
    </div>
  )
}
