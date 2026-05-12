"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { changePasswordAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ChangePasswordForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append("userId", userId)
    
    startTransition(async () => {
      const res = await changePasswordAction(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        router.push("/home")
        router.refresh()
      }
    })
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Troca de Senha Obrigatória</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Por segurança, crie uma nova senha para acessar a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
              minLength={6}
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Senha e Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
