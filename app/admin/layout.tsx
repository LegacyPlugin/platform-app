"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  ShoppingBag, 
  LogOut, 
    Loader2,
  Home,
  Package,
  Handshake,
  Ticket
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("legacy_token")
    const userStr = localStorage.getItem("legacy_user")

    if (!token || !userStr) {
      router.push("/auth/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }
    } catch (e) {
      router.push("/auth/login")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("legacy_token")
    localStorage.removeItem("legacy_user")
    window.dispatchEvent(new Event("storage"))
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    )
  }

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/plugins", icon: Package, label: "Plugins" },
    { href: "/admin/partners", icon: Handshake, label: "Parceiros" },
    { href: "/admin/coupons", icon: Ticket, label: "Cupons" },
    { href: "/admin/users", icon: Users, label: "Usuários" },
    { href: "/admin/licenses", icon: Shield, label: "Licenças" },
    { href: "/admin/sales", icon: ShoppingBag, label: "Vendas" },
  ]

  return (
    <div className="min-h-screen bg-black text-zinc-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] border-r border-white/5 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white">
                    L
                 </div>
                 <span className="font-bold text-lg text-white">Legacy Admin</span>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(item => {
                const isActive = pathname === item.href
                return (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
            <Link 
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition"
            >
                <Home size={20} />
                <span className="font-medium">Voltar ao Site</span>
            </Link>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
            </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
