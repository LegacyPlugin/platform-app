"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, Loader2, Ticket } from "lucide-react"
import { CouponResponse } from "@/lib/types"

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<CouponResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/coupons", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setCoupons(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover este cupom?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/coupons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setCoupons(coupons.filter(c => c.id !== id))
            } else {
                alert("Erro ao remover cupom.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        }
    }

    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Cupons de Desconto</h1>
                    <p className="text-zinc-400">Gerencie os cupons promocionais da loja.</p>
                </div>
                <Link 
                    href="/admin/coupons/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Novo Cupom
                </Link>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por código..." 
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
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">Desconto</th>
                                <th className="px-6 py-4">Uso / Limite</th>
                                <th className="px-6 py-4">Validade</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Carregando cupons...
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        Nenhum cupom encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map(coupon => (
                                    <tr key={coupon.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                                    <Ticket size={20} />
                                                </div>
                                                <div className="font-mono font-bold text-white">{coupon.code}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-bold">
                                            {coupon.discountPercent}% OFF
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {coupon.usages} / {coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">
                                            {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString('pt-BR') : "Indeterminado"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {coupon.active ? (
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
                                                onClick={() => handleDelete(coupon.id)}
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