import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gift } from "lucide-react"

export default async function PerfilPage() {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Meu Perfil</h1>
      </header>

      {/* Bonus Link for Mobile Only */}
      {user.plan === 'ADVANCED' && (
        <div className="md:hidden">
          <Link href="/bonus" className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 font-semibold active:scale-[0.98] transition-transform">
            <Gift className="w-5 h-5" />
            Acessar Conteúdo Bônus
          </Link>
        </div>
      )}

      <div className="bg-zinc-900 p-4 md:p-6 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <h3 className="text-xs md:text-sm text-zinc-500 font-medium">Nome</h3>
          <p className="text-base md:text-lg text-white font-semibold">{user.name || "Não informado"}</p>
        </div>
        <div>
          <h3 className="text-xs md:text-sm text-zinc-500 font-medium">Email</h3>
          <p className="text-base md:text-lg text-white font-semibold">{user.email}</p>
        </div>
        <div>
          <h3 className="text-xs md:text-sm text-zinc-500 font-medium">Plano Atual</h3>
          <p className="text-base md:text-lg text-white font-semibold">
            {user.plan === 'ADVANCED' ? 'Avançado' : 'Básico'}
          </p>
        </div>
        <div>
          <h3 className="text-xs md:text-sm text-zinc-500 font-medium">Data de Cadastro</h3>
          <p className="text-base md:text-lg text-white font-semibold">
            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(user.createdAt))}
          </p>
        </div>
      </div>

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <Button variant="destructive" className="w-full h-12 md:h-10 md:w-auto text-base md:text-sm">Sair da Conta</Button>
      </form>
    </div>
  )
}
