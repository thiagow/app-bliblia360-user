"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {
    setIsPending(true)

    try {
      // 1. Busca o CSRF token exigido pelo next-auth para o signout
      const csrfRes = await fetch("/api/auth/csrf")
      const { csrfToken } = await csrfRes.json()

      // 2. Faz o POST manual ao endpoint de signout.
      //    O browser aplica o Set-Cookie da resposta (que remove o cookie de sessão)
      //    ANTES de qualquer navegação ocorrer.
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken }),
        // 'same-origin' garante que os cookies da resposta sejam aceitos
        credentials: "same-origin",
        // 'manual' impede que o fetch siga o redirect 3xx — só queremos o cookie
        redirect: "manual",
      })

      // 3. Agora o cookie está definitivamente apagado pelo browser.
      //    Hard navigation para /login — o middleware não encontrará mais sessão.
      window.location.href = "/login"
    } catch (err) {
      console.error("[LogoutButton] Erro ao fazer logout:", err)
      // Fallback: tenta navegar mesmo assim
      window.location.href = "/login"
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
      className="w-full h-12 md:h-10 md:w-auto text-base md:text-sm"
    >
      {isPending ? "Saindo..." : "Sair da Conta"}
    </Button>
  )
}
