import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Bem-vindo(a), {user?.name || 'Estudante'}!</h1>
        <p className="text-sm md:text-base text-zinc-400 mt-2">Retome seus estudos bíblicos e fortaleça sua fé.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <a href="/biblioteca" className="block p-5 md:p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-amber-500/50 transition-colors active:scale-[0.98]">
          <h3 className="text-lg font-bold text-white mb-2">Biblioteca de Mapas</h3>
          <p className="text-sm text-zinc-400 mb-4">Acesse mapas, resumos e PDFs exclusivos.</p>
          <span className="text-amber-500 text-sm font-semibold flex items-center gap-2">Acessar <span aria-hidden="true">&rarr;</span></span>
        </a>
        
        <a href="/devocional" className="block p-5 md:p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-amber-500/50 transition-colors active:scale-[0.98]">
          <h3 className="text-lg font-bold text-white mb-2">Devocional 360°</h3>
          <p className="text-sm text-zinc-400 mb-4">Gerencie as emoções com a sabedoria da Bíblia.</p>
          <span className="text-amber-500 text-sm font-semibold flex items-center gap-2">Ler hoje <span aria-hidden="true">&rarr;</span></span>
        </a>
        
        <a href="/guia-da-fe" className="block p-5 md:p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-amber-500/50 transition-colors active:scale-[0.98]">
          <h3 className="text-lg font-bold text-white mb-2">Guia da Fé</h3>
          <p className="text-sm text-zinc-400 mb-4">Trilha passo a passo para destrave espiritual.</p>
          <span className="text-amber-500 text-sm font-semibold flex items-center gap-2">Continuar trilha <span aria-hidden="true">&rarr;</span></span>
        </a>
      </div>
    </div>
  )
}
