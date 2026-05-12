"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const handleLogout = async () => {
    // Usamos o redirecionamento nativo do next-auth para garantir que
    // o cookie de sessão seja removido via HTTP response antes de navegar.
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleLogout}
      className="w-full h-12 md:h-10 md:w-auto text-base md:text-sm"
    >
      Sair da Conta
    </Button>
  )
}
