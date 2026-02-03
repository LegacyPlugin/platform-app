"use client"

import React, { useEffect, useState } from "react"
import { LicenseResponse } from "@/lib/types"
import { Search, MoreVertical, RefreshCw } from "lucide-react"

export default function AdminLicensesPage() {
    const [licenses, setLicenses] = useState<LicenseResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

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
                alert("HWID resetado com sucesso!")
                fetchLicenses()
            } else {
                alert("Erro ao resetar HWID.")
            }
        } catch (e) {
            console.error(e)
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
        </div>
    )
}
