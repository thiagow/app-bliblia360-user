"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { changePasswordAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ChangePasswordForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    formData.append("userId", userId)

    try {
      const res = await changePasswordAction(formData)

      if (!res || res.error) {
        setError(res?.error ?? "Erro ao salvar a senha.")
        setIsPending(false)
        return
      }

      // Re-autentica com a nova senha via next-auth/react (mesmo fluxo do login)
      const result = await signIn("credentials", {
        email: res.email,
        password: res.newPassword,
        redirect: false,
        callbackUrl: "/home",
      })

      if (!result || result.error) {
        setError("Senha alterada, mas erro ao atualizar a sessão. Faça login novamente.")
        setIsPending(false)
        return
      }

      // Hard navigation garante que o cookie atualizado é enviado com o próximo request
      window.location.href = "/home"
    } catch (err) {
      console.error("[ChangePasswordForm] error:", err)
      setError("Erro interno. Tente novamente.")
      setIsPending(false)
    }
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
              autoComplete="new-password"
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
              autoComplete="new-password"
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Salvar Senha e Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
