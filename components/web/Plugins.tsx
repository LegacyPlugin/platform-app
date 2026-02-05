"use client"

import React, { useEffect, useState } from "react"
import {
  LayoutGrid,
  Settings,
  Castle,
  Gamepad2,
  Box,
  Pickaxe,
  ShoppingCart,
  ArrowDownAZ,
  Filter,
  Eye,
  X,
  Check,
  Video,
  Terminal,
  Shield,
  List,
  Info
} from "lucide-react"
import { Plugin } from "@/lib/types"
import { createPortal } from "react-dom"

type CategoryKey =
  | "all"
  | "administracao"
  | "factions"
  | "minigames"
  | "outros"
  | "rankup"

type SortKey = "recentes" | "todos"

import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"

type PluginItem = {
  id: string
  identifier: string
  name: string
  price: number
  category: Exclude<CategoryKey, "all">
  image: string
  createdAt: string
  original: Plugin
}

const CATEGORIES: {
  key: CategoryKey
  label: string
  icon: React.ReactNode
}[] = [
  { key: "all", label: "Todos", icon: <LayoutGrid size={18} /> },
  { key: "administracao", label: "Administração", icon: <Settings size={18} /> },
  { key: "factions", label: "Factions", icon: <Castle size={18} /> },
  { key: "minigames", label: "Minigames", icon: <Gamepad2 size={18} /> },
  { key: "outros", label: "Outros", icon: <Box size={18} /> },
  { key: "rankup", label: "RankUP", icon: <Pickaxe size={18} /> },
]

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function badgeLabel(cat: PluginItem["category"]) {
  switch (cat) {
    case "administracao":
      return "Administração"
    case "factions":
      return "Factions"
    case "minigames":
      return "Minigames"
    case "outros":
      return "Outros"
    case "rankup":
      return "RankUP"
  }
}

function guessCategory(name: string): Exclude<CategoryKey, "all"> {
  const lower = name.toLowerCase()
  if (lower.includes("faction")) return "factions"
  if (lower.includes("rankup")) return "rankup"
  if (lower.includes("admin") || lower.includes("punish") || lower.includes("chat")) return "administracao"
  if (lower.includes("minigame") || lower.includes("skywars") || lower.includes("bedwars")) return "minigames"
  return "outros"
}

export function PluginsSection() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [activeCat, setActiveCat] = React.useState<CategoryKey>("all")
  const [sort, setSort] = React.useState<SortKey>("todos")
  const [items, setItems] = useState<PluginItem[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)

  useEffect(() => {
    fetch('/api/v1/store/plugins')
      .then(res => res.json())
      .then((data: Plugin[]) => {
        const mappedItems: PluginItem[] = data.map(p => ({
          id: p.id.toString(),
          identifier: p.identifier,
          name: p.name,
          price: p.price,
          category: guessCategory(p.name),
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : "/plugin.svg",
          createdAt: new Date().toISOString(),
          original: p
        }))
        setItems(mappedItems)
      })
      .catch(err => console.error("Error fetching plugins:", err))
  }, [])

  const filtered = React.useMemo(() => {
    let list = items.slice()

    if (activeCat !== "all") {
      list = list.filter((i) => i.category === activeCat)
    }

    if (sort === "recentes") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    return list
  }, [items, activeCat, sort])

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top bar: Categorias + filtros */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Categorias (tabs grandes) */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => {
              const active = c.key === activeCat
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCat(c.key)}
                  className={[
                    "shrink-0 rounded-2xl px-6 py-4",
                    "flex items-center gap-3",
                    "bg-[#121212] text-white/90",
                    "shadow-[0_12px_30px_rgba(0,0,0,0.25)]",
                    "transition hover:bg-[#141414]",
                    active
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "",
                  ].join(" ")}
                >
                  <span className="opacity-95">{c.icon}</span>
                  <span className="text-sm font-semibold">{c.label}</span>
                </button>
              )
            })}
          </div>

          {/* Filtros direita */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setSort("recentes")}
              className={[
                "rounded-xl px-6 py-3",
                "flex items-center gap-2",
                "bg-purple-500 text-white",
                "shadow-[0_10px_24px_rgba(0,0,0,0.25)]",
                "transition hover:brightness-110",
                sort === "recentes" ? "" : "opacity-80",
              ].join(" ")}
            >
              <ArrowDownAZ size={18} />
              <span className="text-sm font-semibold">Mais recentes</span>
            </button>

            <button
              onClick={() => setSort("todos")}
              className={[
                "rounded-xl px-6 py-3",
                "flex items-center gap-2",
                "bg-purple-500 text-white",
                "shadow-[0_10px_24px_rgba(0,0,0,0.25)]",
                "transition hover:brightness-110",
                sort === "todos" ? "" : "opacity-80",
              ].join(" ")}
            >
              <Filter size={18} />
              <span className="text-sm font-semibold">Todos</span>
            </button>
          </div>
        </div>

        {/* Grid de plugins */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={[
                "rounded-3xl bg-[#121212] p-6",
                "shadow-[0_16px_40px_rgba(0,0,0,0.28)]",
                "border border-white/5",
              ].join(" ")}
            >
              {/* imagem */}
              <div className="flex justify-center pt-2">
                <div className="grid h-20 w-20 place-items-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    draggable={false}
                  />
                </div>
              </div>

              {/* badge categoria */}
              <div className="mt-4 flex justify-center">
                <span className="rounded-full bg-[#161616] px-4 py-1 text-xs font-semibold text-purple-500">
                  {badgeLabel(p.category)}
                </span>
              </div>

              {/* nome e preço */}
              <div className="mt-4 text-center">
                <div className="text-lg font-extrabold text-white">
                  {p.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-white/60">
                  {brl(p.price)}
                </div>
              </div>

              {/* botões */}
              <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      addToCart(p.original)
                      router.push("/checkout")
                    }}
                    className={[
                      "w-full rounded-xl bg-purple-500 py-3",
                      "flex items-center justify-center gap-2",
                      "text-sm font-semibold text-white",
                      "shadow-[0_14px_30px_rgba(0,0,0,0.22)]",
                      "transition hover:brightness-110 active:scale-[0.99]",
                    ].join(" ")}
                  >
                    <ShoppingCart size={18} />
                    Comprar
                  </button>

                  <button
                    onClick={() => setSelectedPlugin(p.original)}
                    className="w-full rounded-xl bg-white/5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    Ver Detalhes
                  </button>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/60 py-10">
              Nenhum plugin encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedPlugin && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-[#121212] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPlugin(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition z-10"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column: Image & Basic Info */}
              <div className="p-8 bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5">
                <div className="w-48 h-48 mb-6 relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                  <img 
                    src={selectedPlugin.imageUrls && selectedPlugin.imageUrls.length > 0 ? selectedPlugin.imageUrls[0] : "/plugin.svg"} 
                    alt={selectedPlugin.name}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                </div>
                
                <h2 className="text-3xl font-extrabold text-white mb-2">{selectedPlugin.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                    <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/20">
                        {guessCategory(selectedPlugin.name).toUpperCase()}
                    </span>
                    <span className="text-zinc-400 text-sm font-mono">v{selectedPlugin.compatibleVersions || "LATEST"}</span>
                </div>

                <div className="text-4xl font-bold text-white mb-8">
                    {brl(selectedPlugin.price)}
                </div>

                <button
                    onClick={() => {
                        addToCart(selectedPlugin)
                        setSelectedPlugin(null)
                        router.push("/checkout")
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <ShoppingCart size={20} />
                    Comprar Agora
                </button>
              </div>

              {/* Right Column: Detailed Info */}
              <div className="p-8 space-y-8">
                {selectedPlugin.features && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <List className="text-purple-500" size={20} />
                            Funcionalidades
                        </h3>
                        <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedPlugin.features}
                        </div>
                    </div>
                )}

                {selectedPlugin.commands && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Terminal className="text-green-500" size={20} />
                            Comandos
                        </h3>
                        <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                            {selectedPlugin.commands}
                        </div>
                    </div>
                )}

                {selectedPlugin.permissions && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Shield className="text-blue-500" size={20} />
                            Permissões
                        </h3>
                        <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                            {selectedPlugin.permissions}
                        </div>
                    </div>
                )}

                {selectedPlugin.videoPreview && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Video className="text-red-500" size={20} />
                            Preview
                        </h3>
                        <a 
                            href={selectedPlugin.videoPreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl p-4 text-center text-purple-400 hover:text-purple-300 transition"
                        >
                            Assistir Vídeo Demonstrativo
                        </a>
                    </div>
                )}
                
                {!selectedPlugin.features && !selectedPlugin.commands && !selectedPlugin.permissions && (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-500 space-y-2">
                        <Info size={32} className="opacity-50" />
                        <p>Sem informações adicionais disponíveis.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
