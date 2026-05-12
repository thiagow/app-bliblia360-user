"use client"

import { useState, useCallback } from "react"
import { MonthStats } from "@/components/guia-da-fe/MonthStats"
import { MonthNavigation } from "@/components/guia-da-fe/MonthNavigation"
import { MonthlyCalendar } from "@/components/guia-da-fe/MonthlyCalendar"
import { DaySheet } from "@/components/guia-da-fe/DaySheet"

type Tracker = {
  date: string
  practices: string[]
}

type Props = {
  initialTrackers: Tracker[]
  today: string
  initialYear: number
  initialMonth: number
}

export function GuiadaFeClient({ initialTrackers, today, initialYear, initialMonth }: Props) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers)
  const [loadingMonth, setLoadingMonth] = useState(false)

  // Sheet state
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [sheetPractices, setSheetPractices] = useState<string[]>([])

  async function handleNavigate(newYear: number, newMonth: number) {
    setLoadingMonth(true)
    setYear(newYear)
    setMonth(newMonth)
    try {
      const res = await fetch(`/api/tracker?year=${newYear}&month=${newMonth}`)
      const data = await res.json()
      setTrackers(data.trackers ?? [])
    } catch {
      setTrackers([])
    } finally {
      setLoadingMonth(false)
    }
  }

  const handleDayPress = useCallback(
    (date: string) => {
      const existing = trackers.find((t) => t.date === date)
      setSheetPractices(existing?.practices ?? [])
      setSelectedDate(date)
    },
    [trackers]
  )

  function handleSaved(date: string, practices: string[]) {
    setTrackers((prev) => {
      const existing = prev.find((t) => t.date === date)
      if (existing) {
        return prev.map((t) => (t.date === date ? { ...t, practices } : t))
      }
      return [...prev, { date, practices }]
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Stats */}
      <MonthStats trackers={trackers} today={today} />

      {/* Month navigation */}
      <MonthNavigation year={year} month={month} onNavigate={handleNavigate} />

      {/* Calendar */}
      <div className={`transition-opacity duration-200 ${loadingMonth ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <MonthlyCalendar
          year={year}
          month={month}
          today={today}
          trackers={trackers}
          onDayPress={handleDayPress}
        />
      </div>

      {/* Day Sheet */}
      <DaySheet
        date={selectedDate}
        initialPractices={sheetPractices}
        onClose={() => setSelectedDate(null)}
        onSaved={handleSaved}
      />
    </div>
  )
}
