"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateCouponPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        code: "",
        discountPercent: 10,
        usageLimit: 0,
        validUntil: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("legacy_token")
            
            // Format validUntil to ISO string if present
            const payload = {
                ...formData,
                validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null
            }

            const res = await fetch("/api/v1/admin/coupons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                alert("Cupom criado com sucesso!")
                router.push("/admin/coupons")
            } else {
                const error = await res.text()
                alert(`Erro ao criar cupom: ${error}`)
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
                    href="/admin/coupons"
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Novo Cupom</h1>
                    <p className="text-zinc-400">Crie um código promocional para seus clientes.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Código do Cupom</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition font-mono uppercase"
                        placeholder="Ex: NATAL2025"
                        value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Desconto (%)</label>
                        <input 
                            type="number" 
                            required
                            min="1"
                            max="100"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="10"
                            value={formData.discountPercent}
                            onChange={e => setFormData({...formData, discountPercent: parseFloat(e.target.value)})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Limite de Usos (0 = Infinito)</label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="0"
                            value={formData.usageLimit}
                            onChange={e => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Válido Até (Opcional)</label>
                    <input 
                        type="datetime-local" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition [color-scheme:dark]"
                        value={formData.validUntil}
                        onChange={e => setFormData({...formData, validUntil: e.target.value})}
                    />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Cupom
                    </button>
                </div>

            </form>
        </div>
    )
}