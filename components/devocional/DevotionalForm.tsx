"use client"

import { useState } from "react"
import { saveDevotional } from "@/app/(app)/devocional/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const MOODS = [
  { emoji: "🙏", label: "Grato" },
  { emoji: "🕊️", label: "Em Paz" },
  { emoji: "💪", label: "Confiante" },
  { emoji: "😔", label: "Triste" },
  { emoji: "😰", label: "Ansioso" },
]

export function DevotionalForm() {
  const [mood, setMood] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      formData.append("mood", mood)
      await saveDevotional(formData)
      setSuccess(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar devocional.";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-4 md:p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <h3 className="text-green-500 font-bold mb-2">Devocional Registrado!</h3>
        <p className="text-sm text-green-400">Deus abençoe o seu dia.</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-zinc-900 p-4 md:p-6 rounded-xl border border-zinc-800">
      <div className="space-y-3">
        <Label className="text-zinc-300">Como você está se sentindo hoje?</Label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {MOODS.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setMood(m.label)}
              className={`px-4 py-2.5 md:py-2 rounded-full border text-sm transition-all active:scale-95 ${
                mood === m.label 
                  ? "bg-amber-500 text-zinc-950 border-amber-500 font-medium" 
                  : "bg-zinc-950 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="text" className="text-zinc-300">Sua reflexão, oração ou estudo de hoje</Label>
        <Textarea 
          id="text" 
          name="text" 
          required 
          placeholder="Escreva aqui..." 
          className="min-h-[150px] text-base md:text-sm bg-zinc-950 border-zinc-800 text-zinc-100 p-4"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading || !mood} className="w-full h-12 md:h-10 text-base md:text-sm bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">
        {loading ? "Salvando..." : "Salvar Devocional"}
      </Button>
    </form>
  )
}
