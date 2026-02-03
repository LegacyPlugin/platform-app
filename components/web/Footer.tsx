"use client"

import React from "react"
import { FaDiscord } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo / Nome */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Phoenix Store Logo"
                className="w-12 h-12 object-contain"
                draggable={false}
              />
            </div>
            <span className="text-sm text-white/50">
              Este site não possui vínculos com a Mojang AB
            </span>
          </div>

          {/* Redes sociais */}
          <div className="flex items-center gap-4 text-white/70">
            <a
              href="#"
              className="hover:text-purple-500 transition"
              aria-label="Discord"
            >
              <FaDiscord size={22} />
            </a>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-8 border-t border-white/5 pt-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Lothus Plugins. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
