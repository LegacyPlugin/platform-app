"use client"

import React from "react"
import { useCart } from "@/contexts/CartContext"
import { Header } from "@/components/web/Header"
import { Footer } from "@/components/web/Footer"
import { Trash2, ShoppingCart, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
    const { items, removeFromCart, total } = useCart()

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    return (
        <div className="min-h-screen bg-black text-zinc-200 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition text-zinc-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Checkout</h1>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de Itens */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center">
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingCart size={32} className="text-zinc-600" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
                                <p className="text-zinc-400 mb-8 max-w-md mx-auto">Parece que você ainda não adicionou nenhum plugin ao seu carrinho. Explore nossa loja para encontrar o que precisa.</p>
                                <Link href="/" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition">
                                    Ver Loja
                                </Link>
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-white/10 transition">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-black/50 rounded-2xl flex items-center justify-center border border-white/5 p-4">
                                            <img 
                                                src={item.imageUrls?.[0] || "/plugin.svg"} 
                                                alt={item.name} 
                                                className="h-full w-full object-contain" 
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                            <p className="text-purple-400 font-semibold text-lg">{formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                        title="Remover do carrinho"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Resumo e Pagamento */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Descontos</span>
                                    <span>R$ 0,00</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-xl">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <button 
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
                                disabled={items.length === 0}
                                onClick={() => alert("Funcionalidade de pagamento em breve!")}
                            >
                                <CreditCard size={20} />
                                Pagar com Pix
                            </button>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                <Shield size={12} />
                                <span>Ambiente 100% seguro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
