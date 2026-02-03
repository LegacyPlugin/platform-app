"use client"

import React, { useEffect, useState } from "react"
import { Plugin } from "@/lib/types"
import { Search, Plus, Package, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function AdminPluginsPage() {
    const [plugins, setPlugins] = useState<Plugin[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchPlugins()
    }, [])

    const fetchPlugins = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/plugins", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setPlugins(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este plugin? Todas as versões serão removidas.")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/plugins/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setPlugins(plugins.filter(p => p.id !== id))
            } else {
                alert("Erro ao excluir plugin.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        }
    }

    const filteredPlugins = plugins.filter(plugin =>  
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plugin.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return <div>Carregando plugins...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Plugins</h1>
                    <p className="text-zinc-400">Gerencie o catálogo de produtos.</p>
                </div>
                <Link 
                    href="/admin/plugins/create"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={18} />
                    Novo Plugin
                </Link>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-6">
                    <Search className="text-zinc-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou identificador..." 
                        className="bg-transparent border-none focus:outline-none text-white w-full placeholder-zinc-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-500 text-sm border-b border-white/5">
                                <th className="pb-4 pl-4 font-medium">ID</th>
                                <th className="pb-4 font-medium">Plugin</th>
                                <th className="pb-4 font-medium">Preço</th>
                                <th className="pb-4 font-medium">Versões</th>
                                <th className="pb-4 pr-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPlugins.map(plugin => (
                                <tr key={plugin.id} className="group hover:bg-white/5 transition">
                                    <td className="py-4 pl-4 text-zinc-500 font-mono text-sm">#{plugin.id}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden">
                                                {plugin.imageUrls && plugin.imageUrls.length > 0 ? (
                                                    <img src={plugin.imageUrls[0]} alt={plugin.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{plugin.name}</div>
                                                <div className="text-xs text-zinc-500 font-mono">{plugin.identifier}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-green-400 font-mono font-medium">
                                            {plugin.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </td>
                                    <td className="py-4 text-zinc-400 text-sm">
                                        {plugin.compatibleVersions || "N/A"}
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link 
                                                href={`/admin/plugins/${plugin.id}`}
                                                className="p-2 hover:bg-purple-500/10 rounded-lg text-zinc-400 hover:text-purple-400 transition"
                                                title="Editar Plugin"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(plugin.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition"
                                                title="Excluir Plugin"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredPlugins.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                            Nenhum plugin encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
