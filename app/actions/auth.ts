"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export type AuthState = { error: string | null }

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha incorretos." }
        default:
          console.error("[loginAction] AuthError:", error.type, error.message)
          return { error: `Erro de autenticação: ${error.type}` }
      }
    }
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[loginAction] Unexpected error:", message)
    return { error: "Erro interno ao realizar login. Tente novamente." }
  }

  // Credentials valid — check firstAccess to determine redirect
  try {
    const user = await db.user.findUnique({ where: { email } })
    if (user?.firstAccess) {
      redirect("/change-password")
    }
  } catch {
    // If DB check fails, just go to home
  }

  redirect("/home")
}

export async function changePasswordAction(formData: FormData) {
  const userId = formData.get("userId") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "Senhas não conferem." }
  }

  if (password.length < 6) {
    return { error: "A senha deve ter no mínimo 6 caracteres." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      firstAccess: false,
    },
  })

  // Retorna email e nova senha para o cliente re-autenticar via next-auth/react
  return { success: true, email: user.email, newPassword: password }
}
