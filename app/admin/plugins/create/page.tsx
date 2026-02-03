"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, X } from "lucide-react"
import Link from "next/link"

export default function CreatePluginPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        identifier: "",
        price: 0,
        compatibleVersions: "",
        features: "",
        commands: "",
        permissions: "",
        videoPreview: "",
        imageUrl: "" // Simple input for now, handled as array in submit
    })

    const [versionData, setVersionData] = useState({
        version: "1.0.0",
        changelog: "Lançamento inicial",
        file: null as File | null
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("legacy_token")
            
            // 1. Create Plugin
            const payload = {
                ...formData,
                imageUrls: formData.imageUrl ? [formData.imageUrl] : []
            }

            const res = await fetch("/api/v1/admin/plugins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const error = await res.text()
                throw new Error(error)
            }

            const plugin = await res.json()
            const pluginId = plugin.id

            // 2. Upload Version if file selected
            if (versionData.file) {
                const formDataVersion = new FormData()
                formDataVersion.append("version", versionData.version)
                formDataVersion.append("changelog", versionData.changelog)
                formDataVersion.append("file", versionData.file)

                const resVersion = await fetch(`/api/v1/admin/plugins/${pluginId}/versions`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formDataVersion
                })

                if (!resVersion.ok) {
                    alert("Plugin criado, mas erro ao enviar versão: " + await resVersion.text())
                    router.push("/admin/plugins")
                    return
                }
            }

            alert("Plugin criado com sucesso!")
            router.push("/admin/plugins")
            
        } catch (e: any) {
            console.error(e)
            alert(`Erro ao criar plugin: ${e.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/plugins"
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Novo Plugin</h1>
                    <p className="text-zinc-400">Adicione um novo produto ao catálogo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Nome do Plugin</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="Ex: Rank System"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Identificador (Único)</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition font-mono"
                            placeholder="Ex: rank-system"
                            value={formData.identifier}
                            onChange={e => setFormData({...formData, identifier: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Preço (R$)</label>
                        <input 
                            type="number" 
                            required
                            step="0.01"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Versões Compatíveis</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            placeholder="Ex: 1.8 - 1.20"
                            value={formData.compatibleVersions}
                            onChange={e => setFormData({...formData, compatibleVersions: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">URL da Imagem (Capa)</label>
                    <input 
                        type="url" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                        placeholder="https://..."
                        value={formData.imageUrl}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">URL do Vídeo (YouTube)</label>
                    <input 
                        type="url" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                        placeholder="https://youtube.com/..."
                        value={formData.videoPreview}
                        onChange={e => setFormData({...formData, videoPreview: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Features (Lista)</label>
                        <textarea 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition h-32 resize-none"
                            placeholder="Uma feature por linha..."
                            value={formData.features}
                            onChange={e => setFormData({...formData, features: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Comandos</label>
                        <textarea 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition h-32 resize-none font-mono text-sm"
                            placeholder="/comando - descrição..."
                            value={formData.commands}
                            onChange={e => setFormData({...formData, commands: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Permissões</label>
                        <textarea 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition h-32 resize-none font-mono text-sm"
                            placeholder="plugin.admin - Acesso total..."
                            value={formData.permissions}
                            onChange={e => setFormData({...formData, permissions: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Versão Inicial (Arquivo JAR)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Versão</label>
                            <input 
                                type="text" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                placeholder="1.0.0"
                                value={versionData.version}
                                onChange={e => setVersionData({...versionData, version: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Arquivo .jar</label>
                            <input 
                                type="file" 
                                accept=".jar"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                onChange={e => setVersionData({...versionData, file: e.target.files ? e.target.files[0] : null})}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Changelog</label>
                            <textarea 
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition h-20 resize-none"
                                placeholder="Notas da versão..."
                                value={versionData.changelog}
                                onChange={e => setVersionData({...versionData, changelog: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Plugin
                    </button>
                </div>

            </form>
        </div>
    )
}
