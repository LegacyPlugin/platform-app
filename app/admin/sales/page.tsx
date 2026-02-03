"use client"

import React, { useEffect, useState } from "react"
import { Search, Loader2, Trash2, ShoppingBag } from "lucide-react"
import { AdminSaleResponse } from "@/lib/types"

export default function SalesPage() {
    const [sales, setSales] = useState<AdminSaleResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/sales", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setSales(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSales()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover esta venda?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/sales/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setSales(sales.filter(s => s.id !== id))
            } else {
                alert("Erro ao remover venda.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        }
    }

    const filteredSales = sales.filter(s => 
        s.customerEmail.toLowerCase().includes(search.toLowerCase()) || 
        s.pluginName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Vendas</h1>
                <p className="text-zinc-400">Histórico completo de transações.</p>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por email ou plugin..." 
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
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Carregando vendas...
                                    </td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                        Nenhuma venda encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map(sale => (
                                    <tr key={sale.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-sm">#{sale.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                    <ShoppingBag size={16} />
                                                </div>
                                                <span className="font-medium text-white">{sale.pluginName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {sale.customerEmail}
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-medium">
                                            R$ {sale.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 text-sm">
                                            {new Date(sale.createdAt).toLocaleDateString('pt-BR')} {new Date(sale.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(sale.id)}
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