"use client"

import React, { useEffect, useState } from "react"
import { DashboardStatsResponse } from "@/lib/types"
import { 
    Users, 
    Shield, 
    ShoppingBag, 
    DollarSign, 
    Server, 
    TrendingUp 
} from "lucide-react"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("legacy_token")
                const res = await fetch("/api/v1/admin/dashboard/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    setStats(await res.json())
                }
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (isLoading) return <div>Carregando estatísticas...</div>
    if (!stats) return <div>Erro ao carregar dados.</div>

    const cards = [
        { label: "Receita Total", value: stats.totalRevenue, prefix: "R$ ", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        { label: "Usuários", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Licenças Ativas", value: stats.activeLicenses, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { label: "Servidores Online", value: stats.onlineServers, icon: Server, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
                <p className="text-zinc-400">Monitoramento em tempo real da plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-[#121212] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition">
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition ${card.color}`}>
                            <card.icon size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} ${card.border} border`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                            <p className="text-zinc-400 text-sm font-medium">{card.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {card.prefix && <span className="text-lg text-zinc-500 mr-1">{card.prefix}</span>}
                                {typeof card.value === 'number' && card.prefix 
                                    ? card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) 
                                    : card.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Stats Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-400" />
                        Top Plugins (Mais Vendidos)
                    </h3>
                    <div className="space-y-4">
                        {stats.topPlugins?.map((plugin, index) => (
                             <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-sm">
                                        #{index + 1}
                                    </span>
                                    <span className="font-medium text-white">{plugin.name}</span>
                                </div>
                                <span className="text-zinc-400 text-sm">{plugin.sales} vendas</span>
                             </div>
                        )) || <p className="text-zinc-500">Nenhum dado disponível.</p>}
                    </div>
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Métricas Rápidas</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-zinc-400 text-sm">Ticket Médio</span>
                            <span className="text-white font-mono font-medium">
                                {stats.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                             <span className="text-zinc-400 text-sm">Receita Mensal</span>
                             <span className="text-green-400 font-mono font-medium">
                                 {stats.monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                             </span>
                        </div>
                         <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                             <span className="text-zinc-400 text-sm">Total Parceiros</span>
                             <span className="text-white font-mono font-medium">
                                 {stats.totalPartners}
                             </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
