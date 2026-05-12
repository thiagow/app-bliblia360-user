"use client"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => { window.location.href = "/api/logout" }}
      className="w-full h-12 md:h-10 md:w-auto text-base md:text-sm"
    >
      Sair da Conta
    </Button>
  )
}
