import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ChangePasswordPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (!session.user.firstAccess) {
    redirect("/home")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif text-amber-500">Bíblia 360°</h1>
          <p className="text-zinc-400 mt-2">Bem-vindo(a)! Defina sua nova senha.</p>
        </div>
        <ChangePasswordForm userId={session.user.id} />
      </div>
    </div>
  )
}
