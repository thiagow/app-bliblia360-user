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
          return { error: "Credenciais inválidas." }
        default:
          return { error: "Erro ao realizar login." }
      }
    }
    throw error; // required for NextAuth redirects to work correctly if redirect was true, but we use redirect: false
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
    if (error instanceof AuthError) {
      return { error: "Erro ao atualizar a sessão." }
    }
    throw error;
  }

  revalidatePath("/")

  return { success: true }
}
