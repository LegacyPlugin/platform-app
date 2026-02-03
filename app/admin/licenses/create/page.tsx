"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Shield, Check } from "lucide-react"
import { Plugin } from "@/lib/types"

export default function AdminCreateLicensePage() {
    const router = useRouter()
    const [plugins, setPlugins] = useState<Plugin[]>([])
    const [isLoading, setIsLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        validUntil: "",
        allowedPluginIds: [] as number[]
    })

    useEffect(() => {
        const fetchPlugins = async () => {
            try {
                const token = localStorage.getItem("legacy_token")
                const res = await fetch("/api/v1/admin/plugins", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) setPlugins(await res.json())
            } catch (e) {
                console.error(e)
            }
        }
        fetchPlugins()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const token = localStorage.getItem("legacy_token")
            const payload = {
                ...formData,
                validUntil: new Date(formData.validUntil).toISOString()
            }

            const res = await fetch("/api/v1/admin/licenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                alert("Licença criada com sucesso!")
                router.push("/admin/licenses")
            } else {
                const text = await res.text()
                alert(`Erro ao criar licença: ${text}`)
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        } finally {
            setIsLoading(false)
        }
    }

    const togglePlugin = (id: number) => {
        setFormData(prev => {
            const ids = prev.allowedPluginIds.includes(id)
                ? prev.allowedPluginIds.filter(pid => pid !== id)
                : [...prev.allowedPluginIds, id]
            return { ...prev, allowedPluginIds: ids }
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Nova Licença</h1>
                    <p className="text-zinc-400">Crie uma licença manual para um cliente.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-8">
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                        <Shield size={20} className="text-purple-400" />
                        Dados do Cliente
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Nome do Cliente</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.customerName}
                                onChange={e => setFormData({...formData, customerName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Email</label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Validade (Data e Hora)</label>
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition [color-scheme:dark]"
                            value={formData.validUntil}
                            onChange={e => setFormData({...formData, validUntil: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                        <Check size={20} className="text-purple-400" />
                        Plugins Permitidos
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plugins.map(plugin => (
                            <div 
                                key={plugin.id}
                                onClick={() => togglePlugin(plugin.id)}
                                className={`
                                    cursor-pointer p-3 rounded-xl border transition flex items-center gap-3
                                    ${formData.allowedPluginIds.includes(plugin.id)
                                        ? "bg-purple-500/10 border-purple-500/50"
                                        : "bg-zinc-900/50 border-white/5 hover:bg-zinc-900"
                                    }
                                `}
                            >
                                <div className={`
                                    w-5 h-5 rounded flex items-center justify-center transition
                                    ${formData.allowedPluginIds.includes(plugin.id)
                                        ? "bg-purple-500 text-white"
                                        : "bg-zinc-800 border border-white/10"
                                    }
                                `}>
                                    {formData.allowedPluginIds.includes(plugin.id) && <Check size={12} />}
                                </div>
                                <span className={`text-sm font-medium ${
                                    formData.allowedPluginIds.includes(plugin.id) ? "text-white" : "text-zinc-400"
                                }`}>
                                    {plugin.name}
                                </span>
                            </div>
                        ))}
                        {plugins.length === 0 && (
                            <div className="col-span-full text-zinc-500 text-center py-4">
                                Nenhum plugin disponível.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? "Criando..." : (
                            <>
                                <Save size={18} />
                                Criar Licença
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
