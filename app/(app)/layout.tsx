import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home, BookOpen, Heart, Map, User } from "lucide-react"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const { plan } = session.user

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Topbar (Mobile Only) */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-40">
        <h2 className="text-xl font-serif text-amber-500">Bíblia 360°</h2>
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
          {plan === 'ADVANCED' ? 'Avançado' : 'Básico'}
        </span>
      </header>

      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-900 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-serif text-amber-500">Bíblia 360°</h2>
          <p className="text-xs text-zinc-400 mt-1">Plano {plan === 'ADVANCED' ? 'Avançado' : 'Básico'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/home" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium transition-colors">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/biblioteca" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium transition-colors">
            <Map className="w-4 h-4" /> Biblioteca
          </Link>
          <Link href="/devocional" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium transition-colors">
            <Heart className="w-4 h-4" /> Devocional
          </Link>
          <Link href="/guia-da-fe" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> Guia da Fé
          </Link>
          {plan === 'ADVANCED' && (
            <Link href="/bonus" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium text-amber-500 transition-colors mt-4">
              Conteúdo Bônus
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link href="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800 text-sm font-medium transition-colors">
            <User className="w-4 h-4" /> Meu Perfil
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md z-50 pb-safe">
        <div className="flex items-center justify-around p-2">
          <Link href="/home" className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-500 active:text-amber-500">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/biblioteca" className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-500 active:text-amber-500">
            <Map className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Biblioteca</span>
          </Link>
          <Link href="/devocional" className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-500 active:text-amber-500">
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Devocional</span>
          </Link>
          <Link href="/guia-da-fe" className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-500 active:text-amber-500">
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Guia</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-amber-500 active:text-amber-500">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
