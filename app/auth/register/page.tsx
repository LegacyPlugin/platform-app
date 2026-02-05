"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Lock, Loader2, ArrowLeft, Mail } from "lucide-react"
import { RegisterRequest, AuthResponse, ClientProfileResponse } from "@/lib/types"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const body: RegisterRequest = { username, password, email }

      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
         try {
            const data = await res.json()
            throw new Error(data.message || "Erro ao criar conta")
        } catch (e) {
             throw new Error("Erro ao criar conta")
        }
      }

      const data: AuthResponse = await res.json()
      
      // Save token
      localStorage.setItem("legacy_token", data.token)
      
      // Fetch user profile
      const profileRes = await fetch("/api/v1/client/me", {
        headers: { Authorization: `Bearer ${data.token}` }
      })

      if (profileRes.ok) {
        const profile: ClientProfileResponse = await profileRes.json()
        localStorage.setItem("legacy_user", JSON.stringify(profile))
        
        window.dispatchEvent(new Event("storage"))
        
        // Registering users are typically not ADMIN, but let's check anyway or just go to home
        if (profile.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
         throw new Error("Erro ao carregar perfil do usuário")
      }
      
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

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
            <h1 className="text-2xl font-bold text-white mb-2">Criar nova conta</h1>
            <p className="text-zinc-400 text-sm">Junte-se a nós para ter acesso aos melhores plugins</p>
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
                  placeholder="Escolha um nome de usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/50 border border-white/5 py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/50 border border-white/5 py-3.5 pl-11 pr-4 text-white placeholder-zinc-700 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="Crie uma senha segura"
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
                "Criar conta"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
