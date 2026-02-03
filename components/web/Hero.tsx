"use client"

import React from "react"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  LayoutGrid,
  BarChart3,
  Wrench,
  Lock,
} from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl container mx-auto overflow-hidden bg-zinc-950">
      {/* fundo bem leve */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#11041c]" />

      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-16 lg:py-20">
        {/* No mobile, a imagem aparece primeiro e o texto depois; ambos centralizados no mobile */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          {/* LEFT (Texto) */}
          <div className="max-w-xl w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-700 via-purple-900 to-zinc-950 px-4 py-1.5 text-xs font-extrabold tracking-wide text-white">
              LOJA DE PLUGINS DE MINECRAFT
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-medium leading-tight tracking-tight text-white">
              Dê superpoderes ao seu servidor!
              <br />
              
            </h1>

            <ul className="mt-7 space-y-3 text-sm sm:text-base text-zinc-300 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
              <Li>Plugins exclusivos prontos para uso</Li>
              <Li>Atualizações frequentes e suporte dedicado</Li>
              <Li>Integração fácil com qualquer servidor</Li>
              <Li>Top funcionalidades para crescer sua comunidade</Li>
              <Li>Compra segura e rápida, confira as novidades!</Li>
            </ul>

            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5 w-full sm:justify-start justify-center">
              <a
                href="/loja"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-purple-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:bg-purple-800 transition"
              >
                Ver plugins disponíveis
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              </a>

            
            </div>
          </div>

          {/* RIGHT (Imagem) */}
          <div className="relative flex items-center justify-center w-full">
            {/* Imagem temática Minecraft plugin loja */}
            <div className="absolute right-0 top-0 h-full w-full flex items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                <img
                  src="https://ystoreplugins.com.br/app/templates/site/assets/images/new_skin.webp"
                  className=""
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  alt="Minecraft plugin loja"
                />

                {/* bolhas/ícones flutuando - relacionados com plugins/Minecraft */}

                {/* barra do "link seguro" simulando compra segura */}
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Lista customizada
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 className="text-purple-400" size={18} />
      <span className="font-semibold text-white">{children}</span>
    </li>
  )
}

// Ícones flutuantes: aceitam label ou ícone. Label pode ser um emoji.
function FloatIcon({
  className,
  Icon,
  label,
}: {
  className: string
  Icon?: React.ElementType
  label?: React.ReactNode
}) {
  return (
    <div
      className={[
        "absolute z-10 grid place-items-center",
        "h-14 w-14 rounded-full bg-zinc-900 shadow-lg border border-white/10",
        className,
      ].join(" ")}
    >
      {label ? (
        <span className="text-xl font-extrabold text-purple-400">{label}</span>
      ) : Icon ? (
        <Icon className="text-purple-400" size={24} />
      ) : null}
    </div>
  )
}
