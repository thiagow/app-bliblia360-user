"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function loginAction(formData: FormData) {
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
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha incorretos." }
        default:
          return { error: `Erro de autenticação: ${error.type}` }
      }
    }
    // Captura erros de banco de dados ou Prisma e retorna mensagem legível
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[loginAction] Unexpected error:", message)
    return { error: `Erro interno ao realizar login. Tente novamente.` }
  }
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
    }
  })

  // Atualiza a sessão (JWT cookie) logando o usuário novamente com a nova senha
  try {
    await signIn("credentials", {
      email: user.email,
      password: password,
      redirect: false,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[changePasswordAction] signIn error:", message)
    return { error: "Senha alterada, mas erro ao atualizar a sessão. Faça login novamente." }
  }

  revalidatePath("/")

  return { success: true }
}
