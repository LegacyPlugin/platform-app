"use client"

import React, { useEffect, useState } from "react"
import { LicenseResponse } from "@/lib/types"
import { Search, MoreVertical, RefreshCw, Trash2, Edit, Loader2, Save, X } from "lucide-react"
import { createPortal } from "react-dom"
import { toast } from "sonner"

export default function AdminLicensesPage() {
    const [licenses, setLicenses] = useState<LicenseResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingLicense, setEditingLicense] = useState<LicenseResponse | null>(null)
    const [editForm, setEditForm] = useState({
        customerName: "",
        email: "",
        active: true
    })
    const [isSaving, setIsSaving] = useState(false)

    const fetchLicenses = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/licenses", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setLicenses(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLicenses()
    }, [])

    const handleResetHWID = async (key: string) => {
        if (!confirm("Resetar HWID desta licença?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/licenses/${key}/reset`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                toast.success("HWID resetado com sucesso!")
                fetchLicenses()
            } else {
                toast.error("Erro ao resetar HWID.")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro de conexão.")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta licença?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/licenses/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                toast.success("Licença excluída com sucesso!")
                setLicenses(licenses.filter(l => l.id !== id))
            } else {
                toast.error("Erro ao excluir licença.")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro de conexão.")
        }
    }

    const handleEdit = (license: LicenseResponse) => {
        setEditingLicense(license)
        setEditForm({
            customerName: license.customerName,
            email: license.email,
            active: license.active
        })
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingLicense) return
        setIsSaving(true)
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/licenses/${editingLicense.licenseKey}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(editForm)
            })
            if (res.ok) {
                toast.success("Licença atualizada com sucesso!")
                fetchLicenses()
                setIsEditModalOpen(false)
            } else {
                toast.error("Erro ao atualizar licença.")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro de conexão.")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredLicenses = licenses.filter(license => 
        license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()) || 
        license.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return <div>Carregando licenças...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Licenças</h1>
                    <p className="text-zinc-400">Gerencie as licenças de software.</p>
                </div>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-6">
                    <Search className="text-zinc-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por chave, cliente ou email..." 
                        className="bg-transparent border-none focus:outline-none text-white w-full placeholder-zinc-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-500 text-sm border-b border-white/5">
                                <th className="pb-4 pl-4 font-medium">Chave</th>
                                <th className="pb-4 font-medium">Cliente</th>
                                <th className="pb-4 font-medium">Plugins</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">HWID</th>
                                <th className="pb-4 pr-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLicenses.map(license => (
                                <tr key={license.id} className="group hover:bg-white/5 transition">
                                    <td className="py-4 pl-4">
                                        <div className="font-mono text-purple-400 text-sm truncate w-32" title={license.licenseKey}>
                                            {license.licenseKey}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div>
                                            <div className="font-medium text-white">{license.customerName}</div>
                                            <div className="text-xs text-zinc-500">{license.email}</div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {license.allowedPlugins.map((plugin, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-white/5">
                                                    {plugin}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            license.active 
                                            ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                                            : 'text-red-400 bg-red-500/10 border border-red-500/20'
                                        }`}>
                                            {license.active ? "ATIVO" : "INATIVO"}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`text-xs font-mono ${license.serverFingerprint ? 'text-blue-400' : 'text-zinc-600'}`}>
                                            {license.serverFingerprint ? "Vinculado" : "Livre"}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-right flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleEdit(license)}
                                            className="p-2 hover:bg-purple-500/10 rounded-lg text-zinc-400 hover:text-purple-400 transition"
                                            title="Editar Licença"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleResetHWID(license.licenseKey)}
                                            className="p-2 hover:bg-blue-500/10 rounded-lg text-zinc-400 hover:text-blue-400 transition"
                                            title="Resetar HWID"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(license.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition"
                                            title="Excluir Licença"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredLicenses.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                            Nenhuma licença encontrada.
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal Portal */}
            {isEditModalOpen && editingLicense && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Editar Licença</h2>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Cliente</label>
                                <input 
                                    type="text" 
                                    value={editForm.customerName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Email</label>
                                <input 
                                    type="email" 
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-3 p-3 bg-black/50 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                                    <input 
                                        type="checkbox"
                                        checked={editForm.active}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, active: e.target.checked }))}
                                        className="w-5 h-5 rounded border-white/20 bg-transparent text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm font-medium text-white">Licença Ativa</span>
                                </label>
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
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
