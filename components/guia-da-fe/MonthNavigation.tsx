"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

type Props = {
  year: number
  month: number // 1–12
  onNavigate: (year: number, month: number) => void
}

export function MonthNavigation({ year, month, onNavigate }: Props) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const isCurrentMonth = year === currentYear && month === currentMonth
  const isFutureMonth =
    year > currentYear || (year === currentYear && month > currentMonth)

  function handlePrev() {
    if (month === 1) {
      onNavigate(year - 1, 12)
    } else {
      onNavigate(year, month - 1)
    }
  }

  function handleNext() {
    if (isCurrentMonth || isFutureMonth) return
    if (month === 12) {
      onNavigate(year + 1, 1)
    } else {
      onNavigate(year, month + 1)
    }
  }

  return (
    <div className="flex items-center justify-between px-1">
      <button
        onClick={handlePrev}
        aria-label="Mês anterior"
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-zinc-300" />
      </button>

      <div className="text-center">
        <p className="text-base font-semibold text-white">
          {MONTH_NAMES[month - 1]}
        </p>
        <p className="text-xs text-zinc-500">{year}</p>
      </div>

      <button
        onClick={handleNext}
        aria-label="Próximo mês"
        disabled={isCurrentMonth || isFutureMonth}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          isCurrentMonth || isFutureMonth
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-zinc-800 active:bg-zinc-700"
        }`}
      >
        <ChevronRight className="w-5 h-5 text-zinc-300" />
      </button>
    </div>
  )
}
