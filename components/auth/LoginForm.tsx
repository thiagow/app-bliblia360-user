"use client"

import { useFormState, useFormStatus } from "react-dom"
import { loginAction, type AuthState } from "@/app/actions/auth"
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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      disabled={pending}
    >
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  )
}

const initialState: AuthState = { error: null }

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Acesse sua conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Entre com seu email e senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
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
          {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
