"use client"

import React, { useEffect, useState, useRef } from "react"
import { Plugin } from "@/lib/types"
import { Search, Plus, Package, Edit, Trash2, MoreVertical, X, Save, Loader2, Layers } from "lucide-react"
import Link from "next/link"
import { createPortal } from "react-dom"
import { toast } from "sonner"

export default function AdminPluginsPage() {
    const [plugins, setPlugins] = useState<Plugin[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Menu State
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
    const menuRef = useRef<HTMLDivElement>(null)

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        identifier: "",
        price: 0,
        compatibleVersions: "",
        features: "",
        commands: "",
        permissions: "",
        videoPreview: ""
    })
    const [isSaving, setIsSaving] = useState(false)

    // Close menu when clicking outside or scrolling
    useEffect(() => {
        const handleInteraction = (event: Event) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleInteraction)
        window.addEventListener("scroll", handleInteraction, true)
        return () => {
            document.removeEventListener("mousedown", handleInteraction)
            window.removeEventListener("scroll", handleInteraction, true)
        }
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
            toast.error("Erro ao carregar plugins.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPlugins()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este plugin? Todas as versões serão removidas.")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/plugins/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                toast.success("Plugin excluído com sucesso!")
                setPlugins(plugins.filter(p => p.id !== id))
            } else {
                toast.error("Erro ao excluir plugin.")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro de conexão.")
        }
        setOpenMenuId(null)
    }

    const handleEdit = (plugin: Plugin) => {
        setEditingPlugin(plugin)
        setEditForm({
            name: plugin.name,
            identifier: plugin.identifier,
            price: plugin.price,
            compatibleVersions: plugin.compatibleVersions || "",
            features: plugin.features || "",
            commands: plugin.commands || "",
            permissions: plugin.permissions || "",
            videoPreview: plugin.videoPreview || ""
        })
        setOpenMenuId(null)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingPlugin) return
        setIsSaving(true)
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/plugins/${editingPlugin.id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(editForm)
            })
            if (res.ok) {
                toast.success("Plugin atualizado com sucesso!")
                fetchPlugins()
                setIsEditModalOpen(false)
            } else {
                toast.error("Erro ao atualizar plugin.")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro de conexão.")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredPlugins = plugins.filter(plugin =>  
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plugin.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const activePlugin = plugins.find(p => p.id === openMenuId)

    if (isLoading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
    )

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
                                    <td className="py-4 pr-4 text-right relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                setMenuPos({ top: rect.bottom + 8 + window.scrollY, left: rect.right - 192 + window.scrollX })
                                                setOpenMenuId(openMenuId === plugin.id ? null : plugin.id)
                                            }}
                                            className={`p-2 rounded-lg transition ${openMenuId === plugin.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
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

            {/* Dropdown Menu Portal */}
            {openMenuId && activePlugin && createPortal(
                <div 
                    ref={menuRef}
                    style={{ top: menuPos.top, left: menuPos.left }}
                    className="fixed z-50 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                >
                    <button 
                        onClick={() => handleEdit(activePlugin)}
                        className="w-full px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition"
                    >
                        <Edit size={16} />
                        Editar
                    </button>
                    <Link 
                        href={`/admin/plugins/${activePlugin.id}`}
                        className="w-full px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition"
                    >
                        <Layers size={16} />
                        Gerenciar Versões
                    </Link>
                    <div className="h-px bg-white/5 my-1" />
                    <button 
                        onClick={() => handleDelete(activePlugin.id)}
                        className="w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition"
                    >
                        <Trash2 size={16} />
                        Excluir
                    </button>
                </div>,
                document.body
            )}

            {/* Edit Modal Portal */}
            {isEditModalOpen && editingPlugin && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Editar Plugin</h2>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Nome</label>
                                <input 
                                    type="text" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Identificador</label>
                                <input 
                                    type="text" 
                                    value={editForm.identifier}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, identifier: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Preço (R$)</label>
                                <input 
                                    type="number" 
                                    value={editForm.price}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Versões Compatíveis</label>
                                <input 
                                    type="text" 
                                    value={editForm.compatibleVersions}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, compatibleVersions: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                    placeholder="Ex: 1.8, 1.12, 1.16+"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Features (uma por linha)</label>
                                <textarea 
                                    value={editForm.features}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, features: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition min-h-[100px]"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Comandos</label>
                                <textarea 
                                    value={editForm.commands}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, commands: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition min-h-[80px]"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Permissões</label>
                                <textarea 
                                    value={editForm.permissions}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, permissions: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition min-h-[80px]"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Video Preview (URL)</label>
                                <input 
                                    type="text" 
                                    value={editForm.videoPreview}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, videoPreview: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
