    "use client"

    import React, { useEffect, useState } from "react"
    import { useRouter } from "next/navigation"
    import {
    User,
    Shield,
    Key,
    Download,
    Clock,
    LogOut,
    ShoppingBag,
    RefreshCw,
    Loader2,
    Server,
    AlertCircle,
    Edit2,
    X,
    Check,
    Trophy
    } from "lucide-react"
    import Link from "next/link"
    import { ClientProfileResponse, LicenseResponse, SaleResponse, TopBuyerResponse, ActivityLogResponse } from "@/lib/types"

    export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<ClientProfileResponse | null>(null)
    const [license, setLicense] = useState<LicenseResponse | null>(null)
    const [sales, setSales] = useState<SaleResponse[]>([])
    const [topBuyers, setTopBuyers] = useState<TopBuyerResponse[]>([])
    const [activities, setActivities] = useState<ActivityLogResponse[]>([])
    
    const [isResetting, setIsResetting] = useState(false)
    const [isEditingIp, setIsEditingIp] = useState(false)
    const [newIp, setNewIp] = useState("")
    const [isSavingIp, setIsSavingIp] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("legacy_token")
        if (!token) {
        router.push("/auth/login")
        return
        }

        const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` }

            // Fetch Profile
            const profileRes = await fetch("/api/v1/client/me", { headers })
            if (profileRes.ok) {
            setProfile(await profileRes.json())
            } else if (profileRes.status === 403 || profileRes.status === 401) {
                localStorage.removeItem("legacy_token")
                localStorage.removeItem("legacy_user")
                router.push("/auth/login")
                return
            }

            // Fetch License
            const licenseRes = await fetch("/api/v1/client/license", { headers })
            if (licenseRes.ok) {
            setLicense(await licenseRes.json())
            }

            // Fetch Sales
            const salesRes = await fetch("/api/v1/client/sales", { headers })
            if (salesRes.ok) {
            setSales(await salesRes.json())
            }

            // Fetch Top Buyers
            const topBuyersRes = await fetch("/api/v1/client/top-buyers", { headers })
            if (topBuyersRes.ok) {
                setTopBuyers(await topBuyersRes.json())
            }

            // Fetch Activities
            const activitiesRes = await fetch("/api/v1/client/activities", { headers })
            if (activitiesRes.ok) {
                setActivities(await activitiesRes.json())
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
        }

        fetchData()
    }, [router])

    const handleResetHWID = async () => {
        if (!confirm("Tem certeza que deseja resetar o HWID (Fingerprint) da sua licença?")) return

        setIsResetting(true)
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/client/license/reset", { 
                method: "POST",
                headers: { Authorization: `Bearer ${token}` } 
            })
            
            if (res.ok) {
                alert("HWID resetado com sucesso!")
                // Refresh license data
                const licenseRes = await fetch("/api/v1/client/license", { 
                    headers: { Authorization: `Bearer ${token}` } 
                })
                if (licenseRes.ok) {
                    setLicense(await licenseRes.json())
                }
            } else {
                alert("Erro ao resetar HWID. Tente novamente mais tarde.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro ao conectar com o servidor.")
        } finally {
            setIsResetting(false)
        }
    }

    const handleUpdateIp = async () => {
        if (!newIp) return

        setIsSavingIp(true)
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/client/license/ip", { 
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ ip: newIp })
            })
            
            if (res.ok) {
                alert("IP atualizado com sucesso!")
                setIsEditingIp(false)

                const licenseRes = await fetch("/api/v1/client/license", { 
                    headers: { Authorization: `Bearer ${token}` } 
                })
                if (licenseRes.ok) {
                    setLicense(await licenseRes.json())
                }
            } else {
                alert("Erro ao atualizar IP.")
            }
        } catch (e) {
            console.error(e)
            alert("Erro ao conectar com o servidor.")
        } finally {
            setIsSavingIp(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("legacy_token")
        localStorage.removeItem("legacy_user")
        window.dispatchEvent(new Event("storage"))
        router.push("/")
    }

    if (isLoading) {
        return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-zinc-200 pb-20">
        {/* Navbar simplificada para dashboard */}
        <header className="border-b border-white/5 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
                <img src="/logo.png" alt="Legacy" className="h-8 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-purple-400 hidden sm:block">
                    {profile?.username}
                </span>
                <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-white/5 rounded-full transition text-zinc-400 hover:text-red-400"
                    title="Sair"
                >
                    <LogOut size={18} />
                </button>
            </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            
            {/* Welcome Section */}
            <section>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard do Cliente</h1>
                <p className="text-zinc-400">Gerencie suas licenças, downloads e compras.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - License & Profile */}
                <div className="space-y-8 lg:col-span-2">
                    
                    {/* License Card */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <Key size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Sua Licença</h2>
                                    <p className="text-xs text-zinc-500">Chave de acesso global</p>
                                </div>
                            </div>

                            {license ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="font-mono text-lg text-purple-300 tracking-wider break-all">
                                            {license.licenseKey}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${license.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {license.active ? 'ATIVA' : 'INATIVA'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                    <Server size={14} />
                                                    IP Vinculado
                                                </div>
                                                {!isEditingIp ? (
                                                    <button 
                                                        onClick={() => {
                                                            setNewIp(license.serverIp || "")
                                                            setIsEditingIp(true)
                                                        }}
                                                        className="text-zinc-500 hover:text-purple-400 transition"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => setIsEditingIp(false)}
                                                            className="text-zinc-500 hover:text-red-400 transition"
                                                            disabled={isSavingIp}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={handleUpdateIp}
                                                            className="text-zinc-500 hover:text-green-400 transition"
                                                            disabled={isSavingIp}
                                                        >
                                                            {isSavingIp ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isEditingIp ? (
                                                <input 
                                                    type="text" 
                                                    value={newIp}
                                                    onChange={(e) => setNewIp(e.target.value)}
                                                    placeholder="Ex: 192.168.1.1"
                                                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                                                />
                                            ) : (
                                                <div className="text-white font-mono text-sm">
                                                    {license.serverIp || "Nenhum IP vinculado"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                                                <RefreshCw size={14} />
                                                HWID (Fingerprint)
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-white font-mono text-sm truncate max-w-[120px]">
                                                    {license.serverFingerprint ? "Vinculado" : "Não vinculado"}
                                                </span>
                                                {license.serverFingerprint && (
                                                    <button 
                                                        onClick={handleResetHWID}
                                                        disabled={isResetting}
                                                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded transition border border-red-500/20"
                                                    >
                                                        {isResetting ? "..." : "Resetar"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                                            <Download size={14} /> Plugins Permitidos
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {license.allowedPlugins.length > 0 ? (
                                                license.allowedPlugins.map(plugin => (
                                                    <span key={plugin} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs border border-white/5">
                                                        {plugin}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-zinc-500 text-sm italic">Nenhum plugin vinculado.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="inline-flex p-4 rounded-full bg-zinc-900/50 mb-4 text-zinc-500">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-white font-medium mb-1">Nenhuma licença encontrada</h3>
                                    <p className="text-zinc-500 text-sm">Você ainda não possui uma licença vinculada a este email.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sales History */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Histórico de Compras</h2>
                                <p className="text-xs text-zinc-500">Transações recentes</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {sales.length > 0 ? (
                                sales.map(sale => (
                                    <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{sale.pluginName}</p>
                                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-green-400">
                                                {sale.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Aprovado</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    Nenhuma compra encontrada.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column - Profile Summary */}
                <div className="space-y-8">
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl sticky top-8">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px] mb-4">
                                <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                                    <User size={40} className="text-zinc-300" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white">{profile?.username}</h2>
                            <p className="text-zinc-500 text-sm">{profile?.email || "Sem email"}</p>
                            <span className="mt-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 uppercase tracking-wide">
                                {profile?.role}
                            </span>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-white/5">
                            <div className="flex justify-between text-sm p-2">
                                <span className="text-zinc-500">Licenças Ativas</span>
                                <span className="text-white font-medium">{license?.active ? 1 : 0}</span>
                            </div>
                            <div className="flex justify-between text-sm p-2">
                                <span className="text-zinc-500">Total Gasto</span>
                                <span className="text-white font-medium">
                                    {sales.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm p-2">
                                <span className="text-zinc-500">Plugins Adquiridos</span>
                                <span className="text-white font-medium">{sales.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
                                <p className="text-xs text-zinc-500">Segurança da conta</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {activities.length > 0 ? (
                                activities.map((log, index) => (
                                    <div key={index} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-white">{log.action === "LOGIN" ? "Login realizado" : log.action === "RESET_HWID" ? "Reset de HWID" : log.action === "UPDATE_IP" ? "Atualização de IP" : log.action}</span>
                                            <span className="text-[10px] text-zinc-500 font-mono">
                                                {new Date(log.timestamp).toLocaleDateString('pt-BR')} {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400">{log.details}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            <span className="text-[10px] text-zinc-600 font-mono">{log.ipAddress}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-zinc-500 text-sm">
                                    Nenhuma atividade recente.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Buyers */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/20">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Top Compradores</h2>
                                <p className="text-xs text-zinc-500">Maiores apoiadores</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {topBuyers.length > 0 ? (
                                topBuyers.map((buyer, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                                                index === 0 ? 'bg-yellow-500 text-black' : 
                                                index === 1 ? 'bg-zinc-400 text-black' : 
                                                index === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-white text-sm font-medium truncate max-w-[120px]">{buyer.username}</span>
                                        </div>
                                        <span className="text-xs text-green-400 font-mono">
                                            {buyer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-zinc-500 text-sm">
                                    Nenhum dado disponível.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
    }
