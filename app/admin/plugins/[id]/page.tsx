"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plugin, AdminPluginVersionResponse } from "@/lib/types"
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  FileCode, 
  Clock, 
  FileText,
  Layers,
  Info
} from "lucide-react"

export default function AdminPluginEditPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [activeTab, setActiveTab] = useState<"info" | "versions">("info")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    
    // Plugin Data
    const [plugin, setPlugin] = useState<Plugin | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        identifier: "",
        price: 0,
        compatibleVersions: "",
        features: "",
        commands: "",
        permissions: "",
        videoPreview: "",
        imageUrls: "" // handled as comma separated string for simple editing
    })

    // Versions Data
    const [versions, setVersions] = useState<AdminPluginVersionResponse[]>([])
    const [versionForm, setVersionForm] = useState({
        version: "",
        changelog: "",
        file: null as File | null
    })
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (id) {
            fetchPlugin()
            fetchVersions()
        }
    }, [id])

    const fetchPlugin = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/store/plugins`) // Need to find specific plugin from list or implement get one endpoint
            // Wait, store/plugins lists all. I can filter.
            // But admin/plugins also lists all.
            // Ideally backend should have GET /api/v1/admin/plugins/{id} or I filter client side.
            // Let's filter client side from list for now as I didn't verify GET /{id} exists for admin.
            // Update: LicenseController has GET /{id}, PluginController might not?
            // Let's try filtered list first.
            
            const resList = await fetch("/api/v1/admin/plugins", {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (resList.ok) {
                const plugins: Plugin[] = await resList.json()
                const found = plugins.find(p => p.id === Number(id))
                if (found) {
                    setPlugin(found)
                    setFormData({
                        name: found.name,
                        identifier: found.identifier,
                        price: found.price,
                        compatibleVersions: found.compatibleVersions || "",
                        features: found.features || "",
                        commands: found.commands || "",
                        permissions: found.permissions || "",
                        videoPreview: found.videoPreview || "",
                        imageUrls: found.imageUrls ? found.imageUrls.join(", ") : ""
                    })
                } else {
                    alert("Plugin não encontrado")
                    router.push("/admin/plugins")
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchVersions = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/plugins/${id}/versions`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setVersions(await res.json())
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleUpdatePlugin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const token = localStorage.getItem("legacy_token")
            const payload = {
                ...formData,
                imageUrls: formData.imageUrls.split(",").map(s => s.trim()).filter(s => s.length > 0)
            }

            const res = await fetch(`/api/v1/admin/plugins/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                alert("Plugin atualizado com sucesso!")
                fetchPlugin()
            } else {
                alert("Erro ao atualizar plugin.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleUploadVersion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!versionForm.file || !versionForm.version) {
            alert("Preencha a versão e selecione um arquivo.")
            return
        }

        setIsUploading(true)
        try {
            const token = localStorage.getItem("legacy_token")
            const formDataUpload = new FormData()
            formDataUpload.append("version", versionForm.version)
            formDataUpload.append("changelog", versionForm.changelog)
            formDataUpload.append("file", versionForm.file)

            const res = await fetch(`/api/v1/admin/plugins/${id}/versions`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formDataUpload
            })

            if (res.ok) {
                alert("Versão enviada com sucesso!")
                setVersionForm({ version: "", changelog: "", file: null })
                fetchVersions()
            } else {
                const text = await res.text()
                alert(`Erro ao enviar versão: ${text}`)
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDeleteVersion = async (versionId: number) => {
        if (!confirm("Tem certeza que deseja remover esta versão?")) return

        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch(`/api/v1/admin/plugins/${id}/versions/${versionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setVersions(versions.filter(v => v.id !== versionId))
            } else {
                alert("Erro ao remover versão.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro de conexão.")
        }
    }

    if (isLoading) return <div className="p-8 text-white">Carregando plugin...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Editar Plugin: <span className="text-purple-400">{plugin?.name}</span>
                    </h1>
                    <p className="text-zinc-400">Gerencie detalhes e versões do plugin.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`px-6 py-3 text-sm font-medium transition relative ${
                        activeTab === "info" ? "text-purple-400" : "text-zinc-400 hover:text-white"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Info size={16} />
                        Informações
                    </div>
                    {activeTab === "info" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("versions")}
                    className={`px-6 py-3 text-sm font-medium transition relative ${
                        activeTab === "versions" ? "text-purple-400" : "text-zinc-400 hover:text-white"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Layers size={16} />
                        Versões ({versions.length})
                    </div>
                    {activeTab === "versions" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === "info" ? (
                <form onSubmit={handleUpdatePlugin} className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Nome do Plugin</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Identificador (ID Único)</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.identifier}
                                onChange={e => setFormData({...formData, identifier: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Preço (R$)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Versões Compatíveis</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 1.8 - 1.20"
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.compatibleVersions}
                                onChange={e => setFormData({...formData, compatibleVersions: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Features (HTML/Texto)</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            value={formData.features}
                            onChange={e => setFormData({...formData, features: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Comandos</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.commands}
                                onChange={e => setFormData({...formData, commands: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Permissões</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                value={formData.permissions}
                                onChange={e => setFormData({...formData, permissions: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">URL do Vídeo (YouTube)</label>
                        <input 
                            type="text" 
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            value={formData.videoPreview}
                            onChange={e => setFormData({...formData, videoPreview: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Imagens (URLs separadas por vírgula)</label>
                        <input 
                            type="text" 
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            value={formData.imageUrls}
                            onChange={e => setFormData({...formData, imageUrls: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? "Salvando..." : (
                                <>
                                    <Save size={18} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* Upload Form */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Upload size={18} className="text-purple-400" />
                            Upload Nova Versão
                        </h3>
                        <form onSubmit={handleUploadVersion} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Versão (Ex: 1.0.2)</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                        value={versionForm.version}
                                        onChange={e => setVersionForm({...versionForm, version: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Arquivo JAR</label>
                                    <input 
                                        type="file" 
                                        accept=".jar"
                                        required
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                                        onChange={e => setVersionForm({...versionForm, file: e.target.files?.[0] || null})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Changelog (Opcional)</label>
                                <textarea 
                                    rows={2}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                    value={versionForm.changelog}
                                    onChange={e => setVersionForm({...versionForm, changelog: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={isUploading}
                                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isUploading ? "Enviando..." : (
                                        <>
                                            <Upload size={16} />
                                            Enviar Versão
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Versions List */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-zinc-500 text-sm border-b border-white/5">
                                        <th className="pb-4 pl-4 font-medium">Versão</th>
                                        <th className="pb-4 font-medium">Arquivo</th>
                                        <th className="pb-4 font-medium">Data de Upload</th>
                                        <th className="pb-4 font-medium">Changelog</th>
                                        <th className="pb-4 pr-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {versions.map(v => (
                                        <tr key={v.id} className="group hover:bg-white/5 transition">
                                            <td className="py-4 pl-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                        <FileCode size={16} />
                                                    </div>
                                                    <span className="font-mono text-white">{v.version}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-zinc-400 text-sm font-mono">{v.fileName}</td>
                                            <td className="py-4 text-zinc-400 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {new Date(v.uploadDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 text-zinc-500 text-sm max-w-xs truncate" title={v.changelog}>
                                                {v.changelog || "-"}
                                            </td>
                                            <td className="py-4 pr-4 text-right">
                                                <button 
                                                    onClick={() => handleDeleteVersion(v.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition"
                                                    title="Excluir Versão"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {versions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-zinc-500">
                                                Nenhuma versão enviada ainda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
