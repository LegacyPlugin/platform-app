"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Lock, Loader2, ArrowLeft } from "lucide-react"
import { LoginRequest, AuthResponse } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const body: LoginRequest = { username, password }

      const res = await fetch("/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        try {
            const data = await res.json()
            throw new Error(data.message || "Credenciais inválidas")
        } catch (e) {
             throw new Error("Credenciais inválidas")
        }
      }

      const data: AuthResponse = await res.json()
      
      // Save token
      localStorage.setItem("legacy_token", data.token)
      localStorage.setItem("legacy_user", username)
      
      // Dispatch event for header update (if needed, though page reload handles it)
      // Since we are navigating, the header on the new page will read from localStorage
      window.dispatchEvent(new Event("storage"))
      
      router.push("/")
      
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>

        <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
              <User className="text-purple-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-zinc-400 text-sm">Entre na sua conta para gerenciar seus plugins</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                 {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Usuário</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition" size={18} />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/50 border border-white/5 py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="Seu nome de usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Senha</label>
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition">Esqueceu?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/50 border border-white/5 py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-900/20 hover:bg-purple-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Entrar na conta"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              Não tem uma conta?{" "}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
