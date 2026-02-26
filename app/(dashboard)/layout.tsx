'use client'

import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessionHook = useSession()

  if (!sessionHook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Inicializando...
      </div>
    )
  }

  const { data: session, status } = sessionHook

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando sesión...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No autorizado
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0F1535]">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        {children}
      </main>
    </div>
  )
}
