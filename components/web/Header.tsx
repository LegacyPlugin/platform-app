"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  MessageSquare,
  User,
  Sun,
  ShoppingCart,
  LogOut,
  Trash2
} from "lucide-react"
import { useCart } from "@/contexts/CartContext"

// Simples sheet para o carrinho
function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart, total } = useCart()

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fechar carrinho"
      />
      <aside className="relative z-50 w-80 max-w-6xl h-full bg-zinc-950 border-l border-white/10 shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Seu Carrinho</h2>
          <button
            className="text-zinc-400 hover:text-purple-400 transition"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="flex-1 p-6 text-zinc-300 overflow-y-auto space-y-4">
          {items.length === 0 ? (
             <p>Seu carrinho está vazio.</p>
          ) : (
             items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-2">
                   <div>
                       <p className="text-white font-medium">{item.name}</p>
                       <p className="text-sm text-purple-400">R$ {item.price.toFixed(2)}</p>
                   </div>
                   <button 
                     onClick={() => removeFromCart(item.id)}
                     className="text-zinc-500 hover:text-red-400"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
             ))
          )}
        </div>
        <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex justify-between text-white font-bold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
            </div>
            <Link 
                href="/checkout" 
                onClick={onClose}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-bold transition"
            >
                Finalizar Compra
            </Link>
        </div>
      </aside>
    </div>
  )
}

export function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const { items } = useCart()

  useEffect(() => {
    const user = localStorage.getItem("legacy_user")
    if (user) setUsername(user)

    const handleStorage = () => {
      const user = localStorage.getItem("legacy_user")
      setUsername(user)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("legacy_token")
    localStorage.removeItem("legacy_user")
    setUsername(null)
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <header className="w-full bg-gradient-to-b from-black to-zinc-950 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 h-16">
            <Link href="/">
                <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-12 object-contain cursor-pointer"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
            </Link>
          </div>

          {/* Ações desktop */}
          <div className="hidden md:flex items-center gap-4 text-zinc-300">
            {username ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition">
                   Olá, {username}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-red-400 transition"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 hover:text-purple-400 transition"
              >
                <User size={16} />
                Área do Cliente
              </Link>
            )}

            <button
              className="hover:text-purple-400 transition relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={18} />
              {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {items.length}
                  </span>
              )}
            </button>
          </div>

          {/* Ações mobile */}
          <div className="flex md:hidden items-center gap-4 text-zinc-300">
            {username ? (
              <button 
                onClick={handleLogout}
                className="p-2 hover:text-red-400 transition"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="p-2 flex items-center hover:text-purple-400 transition"
              >
                <User size={18} />
              </Link>
            )}

            <button
              className="p-2 hover:text-purple-400 transition relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={18} />
              {items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {items.length}
                  </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sheet do carrinho */}
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
