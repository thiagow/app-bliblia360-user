import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif text-amber-500">Bíblia 360°</h1>
          <p className="text-zinc-400 mt-2">O Código do Destrave</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
