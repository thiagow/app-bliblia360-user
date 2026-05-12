"use client"

import { useState } from "react"
import { GuiaDaFe } from "@prisma/client"
import { markStepCompleted } from "@/app/(app)/guia-da-fe/actions"

import { CheckCircle, Circle } from "lucide-react"

type Props = {
  step: GuiaDaFe
  isCompleted: boolean
}

export function GuiaStepCard({ step, isCompleted }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      await markStepCompleted(step.id, !isCompleted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`p-6 rounded-xl border transition-colors ${
      isCompleted 
        ? "bg-zinc-900 border-amber-500/50" 
        : "bg-zinc-950 border-zinc-800"
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 font-bold">Dia {step.order}</span>
            <h3 className={`text-lg font-bold ${isCompleted ? "text-white" : "text-zinc-300"}`}>
              {step.title}
            </h3>
          </div>
          <p className="text-sm text-zinc-400 mt-2">{step.content}</p>
        </div>
        <button 
          onClick={handleToggle}
          disabled={loading}
          className="ml-4 flex-shrink-0"
        >
          {isCompleted ? (
            <CheckCircle className="w-8 h-8 text-amber-500" />
          ) : (
            <Circle className="w-8 h-8 text-zinc-600 hover:text-amber-500 transition-colors" />
          )}
        </button>
      </div>

      {step.videoUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800 aspect-video">
          <iframe 
            src={step.videoUrl} 
            className="w-full h-full"
            title={step.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}
