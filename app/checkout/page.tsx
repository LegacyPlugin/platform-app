"use client"

import React, { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, CreditCard, Loader2, QrCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { items, removeFromCart, total, clearCart } = useCart()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    document: ""
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Tentar preencher com dados do usuário logado se houver
    const userStr = localStorage.getItem("legacy_user")
    // O localStorage 'legacy_user' salva apenas o username/email como string ou objeto?
    // Baseado no Header.tsx: const user = localStorage.getItem("legacy_user") -> setUsername(user)
    // Parece ser apenas o username (string).
    // O token está em 'legacy_token'.
    // Idealmente teríamos um endpoint /me para pegar os dados completos.
    
    // Por enquanto deixamos em branco para o usuário preencher
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (items.length === 0) {
        setError("Seu carrinho está vazio.")
        setLoading(false)
        return
    }

    try {
        const payload = {
            customerName: formData.customerName,
            email: formData.email,
            document: formData.document,
            couponCode: coupon,
            pluginIdentifiers: items.map(p => p.identifier)
        }

        const res = await fetch("/api/v1/gateway/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            throw new Error(errData.message || "Erro ao processar checkout")
        }

        const data = await res.json()
        
        if (data.paymentUrl) {
            // Limpar carrinho pois o pedido foi gerado? 
            // Talvez só limpar se o pagamento for confirmado. 
            // Mas para UX, podemos limpar ou manter até ele voltar.
            // Vamos manter por segurança, ou limpar se ele for redirecionado com sucesso.
            // clearCart() 
            window.location.href = data.paymentUrl
        } else {
            throw new Error("URL de pagamento não retornada.")
        }

    } catch (err: any) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
                <p className="text-zinc-400">Adicione plugins para continuar.</p>
                <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
                    Voltar para a loja
                </Link>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                    Finalizar Compra
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Esquerda: Formulário */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <CreditCard className="text-purple-500" size={20} />
                            Dados do Pagamento
                        </h2>
                        
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        name="customerName"
                                        required
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">CPF / Documento</label>
                                    <input 
                                        type="text" 
                                        name="document"
                                        required
                                        value={formData.document}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">E-mail</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white"
                                    placeholder="seu@email.com"
                                />
                                <p className="text-xs text-zinc-500">
                                    A licença será enviada para este e-mail.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Direita: Resumo do Pedido */}
                <div className="space-y-6">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
                        
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-start group">
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{item.name}</p>
                                        <p className="text-sm text-zinc-500">Licença Vitalícia</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-white">R$ {item.price.toFixed(2)}</span>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-zinc-600 hover:text-red-400 transition"
                                            title="Remover"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Cupom de Desconto</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition text-white"
                                        placeholder="Código"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold text-white pt-2">
                                <span>Total</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                form="checkout-form"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-xl transition shadow-lg shadow-purple-900/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Processando...
                                    </>
                                ) : (
                                    "Ir para Pagamento"
                                )}
                            </Button>
                            
                            <p className="text-xs text-center text-zinc-500 mt-4">
                                Pagamento seguro via Pix. Entrega automática.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
