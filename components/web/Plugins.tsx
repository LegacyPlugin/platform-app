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
} from "lucide-react"
import { Plugin } from "@/lib/types"
import { useRouter } from "next/navigation"

type CategoryKey =
  | "all"
  | "administracao"
  | "factions"
  | "minigames"
  | "outros"
  | "rankup"

type SortKey = "recentes" | "todos"

import { useCart } from "@/contexts/CartContext"

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
  const [activeCat, setActiveCat] = React.useState<CategoryKey>("all")
  const [sort, setSort] = React.useState<SortKey>("todos")
  const [items, setItems] = useState<PluginItem[]>([])
  const { addToCart } = useCart()
  const router = useRouter()

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

              {/* botão comprar */}
              <button
                onClick={() => {
                  addToCart(p.original)
                  router.push("/checkout")
                }}
                className={[
                  "mt-6 w-full rounded-xl bg-purple-500 py-3",
                  "flex items-center justify-center gap-2",
                  "text-sm font-semibold text-white",
                  "shadow-[0_14px_30px_rgba(0,0,0,0.22)]",
                  "transition hover:brightness-110 active:scale-[0.99]",
                ].join(" ")}
              >
                <ShoppingCart size={18} />
                Comprar
              </button>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/60 py-10">
              Nenhum plugin encontrado.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
