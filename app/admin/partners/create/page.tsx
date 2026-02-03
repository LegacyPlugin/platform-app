"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Handshake } from "lucide-react"
import Link from "next/link"

export default function CreatePartnerPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        slug: "",
        pixKey: "",
        commissionPercent: 10
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("legacy_token")
            
            const res = await fetch("/api/v1/admin/partners", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                alert("Parceiro criado com sucesso!")
                router.push("/admin/partners")
            } else {
                const error = await res.text()
                alert(`Erro ao criar parceiro: ${error}`)
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/partners"
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Novo Parceiro</h1>
                    <p className="text-zinc-400">Cadastre um novo afiliado no sistema.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Nome do Parceiro</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                        placeholder="Ex: João Silva"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                        placeholder="joao@exemplo.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Slug (Código de Indicação)</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition font-mono"
                            placeholder="Ex: joao10"
                            value={formData.slug}
                            onChange={e => setFormData({...formData, slug: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Comissão (%)</label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            max="100"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="10"
                            value={formData.commissionPercent}
                            onChange={e => setFormData({...formData, commissionPercent: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Chave PIX (Para Pagamento)</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition font-mono"
                        placeholder="CPF, Email ou Aleatória"
                        value={formData.pixKey}
                        onChange={e => setFormData({...formData, pixKey: e.target.value})}
                    />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Parceiro
                    </button>
                </div>

            </form>
        </div>
    )
}