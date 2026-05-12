type Props = {
  trackers: { date: string; practices: string[] }[]
  today: string // "yyyy-MM-dd"
}

function computeStats(trackers: Props["trackers"], today: string) {
  const todayDate = new Date(`${today}T00:00:00.000Z`)
  const year = todayDate.getUTCFullYear()
  const month = todayDate.getUTCMonth()

  // Count days elapsed in the month up to today (inclusive)
  const firstDay = new Date(Date.UTC(year, month, 1))
  const elapsed =
    Math.floor((todayDate.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Days with at least 1 practice (streak logic)
  const activeDates = new Set(
    trackers.filter((t) => t.practices.length > 0).map((t) => t.date)
  )

  // Perfect days (all 7 practices)
  const perfectDays = trackers.filter((t) => t.practices.length === 7).length

  // Total prayers across all days
  const totalPrayers = trackers.reduce(
    (sum, t) => sum + t.practices.filter((p) => p === "oracao").length,
    0
  )

  // Streak: consecutive days ending on today or yesterday with ≥1 practice
  let streak = 0
  const checkDate = new Date(todayDate)
  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0]
    if (activeDates.has(dateStr)) {
      streak++
      checkDate.setUTCDate(checkDate.getUTCDate() - 1)
    } else {
      break
    }
  }

  const progress = elapsed > 0 ? Math.round((activeDates.size / elapsed) * 100) : 0

  return { progress, streak, perfectDays, totalPrayers, activeDays: activeDates.size }
}

export function MonthStats({ trackers, today }: Props) {
  const { progress, streak, perfectDays, totalPrayers } = computeStats(trackers, today)

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Progresso do mês</span>
          <span className="font-semibold text-amber-400">{progress}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center bg-zinc-800/50 rounded-xl py-2.5 px-1">
          <span className="text-xl leading-none">🔥</span>
          <span className="text-base font-bold text-white mt-1">{streak}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5">Sequência</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-zinc-800/50 rounded-xl py-2.5 px-1">
          <span className="text-xl leading-none">⭐</span>
          <span className="text-base font-bold text-white mt-1">{perfectDays}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5">Completos</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-zinc-800/50 rounded-xl py-2.5 px-1">
          <span className="text-xl leading-none">🙏</span>
          <span className="text-base font-bold text-white mt-1">{totalPrayers}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5">Orações</span>
        </div>
      </div>
    </div>
  )
}
