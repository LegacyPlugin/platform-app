"use client"

import React, { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, CreditCard, Loader2, QrCode, Check, Copy, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { QRCodeCanvas } from "qrcode.react"

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
  
  const [pixData, setPixData] = useState<{
    qrCode: string
    copyPaste: string
    transactionId: string
  } | null>(null)

  const [verifying, setVerifying] = useState(false)
  const [successData, setSuccessData] = useState<{
    licenseKey: string
    message: string
  } | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("legacy_user")
    if (userStr) {
        try {
            const user = JSON.parse(userStr)
            setFormData(prev => ({
                ...prev,
                customerName: user.username || "",
                email: user.email || ""
            }))
        } catch (e) {
            if (typeof userStr === "string" && !userStr.startsWith("{")) {
                setFormData(prev => ({ ...prev, customerName: userStr }))
            }
        }
    }
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
        const token = localStorage.getItem("legacy_token")
        const headers: HeadersInit = {
            "Content-Type": "application/json"
        }
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        const payload: any = {
            customerName: formData.customerName,
            email: formData.email,
            document: formData.document.replace(/\D/g, ""),
            pluginIdentifiers: items.map(p => p.identifier)
        }

        if (coupon && coupon.trim().length > 0) {
            payload.couponCode = coupon.trim()
        }

        const res = await fetch("/api/v1/gateway/checkout", {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            let errorMessage = `Erro ao processar checkout (${res.status})`
            try {
                const errData = await res.json()
                console.error("Checkout error data:", errData)
                errorMessage = errData.message || errData.error || errorMessage
            } catch (e) {
                const text = await res.text().catch(() => null)
                console.error("Checkout error text:", text)
                if (text) {
                     const cleanText = text.replace(/<[^>]*>/g, '').slice(0, 100)
                     errorMessage = `Erro: ${cleanText}`
                }
            }
            throw new Error(errorMessage)
        }

        const data = await res.json()
        
        if (data.pixQrCode && data.pixCopyPaste) {
            setPixData({
                qrCode: data.pixQrCode,
                copyPaste: data.pixCopyPaste,
                transactionId: data.preferenceId
            })
        } else if (data.paymentUrl) {
            window.location.href = data.paymentUrl
        } else {
            throw new Error("Dados de pagamento não retornados.")
        }

    } catch (err: any) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
  }

  const copyToClipboard = () => {
      if (pixData?.copyPaste) {
          navigator.clipboard.writeText(pixData.copyPaste)
          alert("Código Pix copiado!")
      }
  }

  const handleVerifyPayment = async () => {
      if (!pixData?.transactionId) return

      setVerifying(true)
      try {
          const res = await fetch("/api/v1/gateway/purchase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  transactionId: pixData.transactionId,
                  customerName: formData.customerName,
                  email: formData.email,
                  pluginIdentifiers: items.map(p => p.identifier)
              })
          })
          
          const data = await res.json()
          
          if (data.status === "Sucesso" || data.status === "SUCCESS") {
              setSuccessData({
                  licenseKey: data.licenseKey,
                  message: data.message
              })
              clearCart()
          } else {
              alert("Pagamento ainda não confirmado. Aguarde alguns instantes e tente novamente.")
          }
      } catch (error) {
          console.error(error)
          alert("Erro ao verificar pagamento.")
      } finally {
          setVerifying(false)
      }
  }

  if (items.length === 0 && !pixData) {
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

            {/* Success Modal Overlay */}
            {successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white text-black rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button 
                            onClick={() => {
                                setSuccessData(null)
                                setPixData(null)
                                router.push("/dashboard")
                            }}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <Check className="text-green-600 w-12 h-12" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-3xl font-extrabold text-black">Pagamento Aprovado!</h2>
                                <p className="text-zinc-600 font-medium">
                                    Sua licença foi gerada com sucesso.
                                </p>
                            </div>

                            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-200">
                                <p className="text-sm text-zinc-500 mb-2">Sua Chave de Licença:</p>
                                <code className="block bg-white p-3 rounded-lg border border-zinc-200 text-lg font-mono font-bold text-purple-600 break-all">
                                    {successData.licenseKey}
                                </code>
                            </div>

                            <Button 
                                onClick={() => router.push("/dashboard")}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                            >
                                Ir para o Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pix Modal Overlay */}
            {pixData && !successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white text-black rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button 
                            onClick={() => setPixData(null)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-extrabold text-black">Falta pouco!</h2>
                                <p className="text-zinc-600 font-medium">
                                    Efetue o pagamento via <span className="font-bold text-black">PIX</span> de {items.length} produto(s) por <span className="font-bold text-black">R$ {total.toFixed(2)}</span>
                                </p>
                            </div>

                            <div className="flex justify-center py-4">
                                <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                                    <QRCodeCanvas 
                                        value={pixData.copyPaste}
                                        size={256}
                                        level="H"
                                        className="w-64 h-64"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button 
                                    onClick={copyToClipboard}
                                    className="w-full bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
                                >
                                    <Copy className="mr-2" size={20} />
                                    Copiar Pix
                                </Button>
                                
                                <Button 
                                    onClick={handleVerifyPayment}
                                    disabled={verifying}
                                    variant="outline"
                                    className="w-full border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white font-bold py-6 text-lg rounded-xl transition-all"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2" size={20} />
                                            Já realizei o pagamento
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
