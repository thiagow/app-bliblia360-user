"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await loginAction(formData)
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
        <CardTitle className="text-2xl text-center">Acesse sua conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Entre com seu email e senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="seu@email.com" 
              required 
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
