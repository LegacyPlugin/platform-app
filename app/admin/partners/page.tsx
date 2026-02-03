"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, Edit2, Loader2, Handshake } from "lucide-react"
import { PartnerResponse } from "@/lib/types"

export default function PartnersPage() {
    const [partners, setPartners] = useState<PartnerResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchPartners = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/partners", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setPartners(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPartners()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover este parceiro?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/partners/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setPartners(partners.filter(p => p.id !== id))
            } else {
                alert("Erro ao remover parceiro.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        }
    }

    const filteredPartners = partners.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Parceiros</h1>
                    <p className="text-zinc-400">Gerencie seus afiliados e parceiros de divulgação.</p>
                </div>
                <Link 
                    href="/admin/partners/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Novo Parceiro
                </Link>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome, slug ou email..." 
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-zinc-400 text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Comissão</th>
                                <th className="px-6 py-4">Saldo</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Carregando parceiros...
                                    </td>
                                </tr>
                            ) : filteredPartners.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        Nenhum parceiro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredPartners.map(partner => (
                                    <tr key={partner.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                                    <Handshake size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{partner.name}</div>
                                                    <div className="text-xs text-zinc-500">{partner.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="bg-black/50 px-2 py-1 rounded text-purple-400 font-mono text-sm">
                                                {partner.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {partner.commissionPercent}%
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-medium">
                                            R$ {partner.balance.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {partner.active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    Ativo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                    Inativo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(partner.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-red-400 transition"
                                                title="Remover"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}