"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Plugin } from "@/lib/types"

interface CartContextType {
    items: Plugin[]
    addToCart: (plugin: Plugin) => void
    removeFromCart: (pluginId: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Plugin[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("cart_items")
        if (stored) {
            try {
                setItems(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse cart items", e)
            }
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("cart_items", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addToCart = (plugin: Plugin) => {
        setItems(prev => {
            if (prev.find(p => p.id === plugin.id)) return prev
            return [...prev, plugin]
        })
    }

    const removeFromCart = (pluginId: number) => {
        setItems(prev => prev.filter(p => p.id !== pluginId))
    }

    const clearCart = () => setItems([])

    const total = items.reduce((acc, curr) => acc + curr.price, 0)

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
