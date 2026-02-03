"use client"

import React, { useEffect, useState } from "react"
import { Search, Loader2, User } from "lucide-react"
import { AdminUserResponse } from "@/lib/types"

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUserResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("legacy_token")
            const res = await fetch("/api/v1/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setUsers(await res.json())
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) || 
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Usuários</h1>
                <p className="text-zinc-400">Visualize todos os usuários cadastrados na plataforma.</p>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou email..." 
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
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Cargo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Carregando usuários...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-sm">#{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                    <User size={16} />
                                                </div>
                                                <span className="font-medium text-white">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {user.email || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                user.role === 'ADMIN' 
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {user.role}
                                            </span>
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