"use client"

import { useState, useEffect, useTransition } from "react"
import { X, Loader2 } from "lucide-react"
import { saveDailyPractices } from "@/app/(app)/guia-da-fe/actions"

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const PRACTICES = [
  { id: "oracao",       emoji: "🙏", label: "Oração" },
  { id: "estudoBiblia", emoji: "📖", label: "Estudo da Bíblia" },
  { id: "louvor",       emoji: "🎵", label: "Louvor" },
  { id: "jejum",        emoji: "🍽️", label: "Jejum" },
  { id: "pregacao",     emoji: "🎧", label: "Assistir Pregação" },
  { id: "culto",        emoji: "⛪", label: "Ir ao Culto" },
  { id: "evangelismo",  emoji: "🗣️", label: "Evangelismo" },
] as const

type Props = {
  date: string | null // "yyyy-MM-dd" or null when closed
  initialPractices: string[]
  onClose: () => void
  onSaved: (date: string, practices: string[]) => void
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  const dayName = d.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" })
  return `${day} de ${MONTH_NAMES[month - 1]} · ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`
}

export function DaySheet({ date, initialPractices, onClose, onSaved }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  // Sync selections when date changes
  useEffect(() => {
    setSelected(new Set(initialPractices))
  }, [date, initialPractices])

  // Prevent body scroll when open
  useEffect(() => {
    if (date) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [date])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleSave() {
    if (!date) return
    const practices = Array.from(selected)
    startTransition(async () => {
      await saveDailyPractices(date, practices)
      onSaved(date, practices)
      onClose()
    })
  }

  const isOpen = !!date

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={date ? `Registro de ${formatDate(date)}` : "Registro diário"}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700/50 rounded-t-3xl shadow-2xl transition-transform duration-400 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Registro diário
            </p>
            <h2 className="text-sm font-semibold text-white mt-0.5">
              {date ? formatDate(date) : ""}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Practice list */}
        <div className="px-4 pb-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {PRACTICES.map((p) => {
            const checked = selected.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                aria-pressed={checked}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 text-left min-h-[52px]
                  ${checked
                    ? "bg-amber-500/10 border-amber-500/50"
                    : "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
                  }
                `}
              >
                {/* Checkbox */}
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150
                    ${checked ? "bg-amber-500 border-amber-500" : "border-zinc-600"}
                  `}
                >
                  {checked && (
                    <svg
                      viewBox="0 0 10 8"
                      fill="none"
                      className="w-3 h-3"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <span className="text-xl leading-none">{p.emoji}</span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    checked ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {p.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Save button */}
        <div className="px-4 pb-8 pt-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl transition-colors min-h-[52px] disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span>Salvar</span>
                <span className="text-sm opacity-70">({selected.size}/7)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
