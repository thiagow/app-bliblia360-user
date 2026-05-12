"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const handleLogout = async () => {
    // signOut client-side limpa a sessão corretamente
    await signOut({ redirect: false })
    // Hard navigation limpa os estados do cliente e força nova requisição sem cookie
    window.location.href = "/login"
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
