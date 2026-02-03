import React from "react";

const aboutCards = [
  {
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 384 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z"></path>
      </svg>
    ),
    iconClasses:
      "rounded-full p-3 text-3xl shrink-0 text-purple-500 dark:text-[#4ADE80] bg-transparent",
    containerClasses:
      "flex items-start gap-4 min-h-[140px] p-6 rounded-xl border text-[#166534] shadow-none bg-transparent",
    title: "Desempenho",
    description:
      "Plugins desenvolvidos com foco em desempenho, otimizando o uso de recursos do servidor para garantir estabilidade e eficiência mesmo em situações de alta demanda. Buscamos entregar sempre o melhor desempenho para servidores de todos os portes.",
  },
  {
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 640 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M512.1 191l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0L552 6.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zm-10.5-58.8c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.7-82.4 14.3-52.8 52.8zM386.3 286.1l33.7 16.8c10.1 5.8 14.5 18.1 10.5 29.1-8.9 24.2-26.4 46.4-42.6 65.8-7.4 8.9-20.2 11.1-30.3 5.3l-29.1-16.8c-16 13.7-34.6 24.6-54.9 31.7v33.6c0 11.6-8.3 21.6-19.7 23.6-24.6 4.2-50.4 4.4-75.9 0-11.5-2-20-11.9-20-23.6V418c-20.3-7.2-38.9-18-54.9-31.7L74 403c-10 5.8-22.9 3.6-30.3-5.3-16.2-19.4-33.3-41.6-42.2-65.7-4-10.9.4-23.2 10.5-29.1l33.3-16.8c-3.9-20.9-3.9-42.4 0-63.4L12 205.8c-10.1-5.8-14.6-18.1-10.5-29 8.9-24.2 26-46.4 42.2-65.8 7.4-8.9 20.2-11.1 30.3-5.3l29.1 16.8c16-13.7 34.6-24.6 54.9-31.7V57.1c0-11.5 8.2-21.5 19.6-23.5 24.6-4.2 50.5-4.4 76-.1 11.5 2 20 11.9 20 23.6v33.6c20.3 7.2 38.9 18 54.9 31.7l29.1-16.8c10-5.8 22.9-3.6 30.3 5.3 16.2 19.4 33.2 41.6 42.1 65.8 4 10.9.1 23.2-10 29.1l-33.7 16.8c3.9 21 3.9 42.5 0 63.5zm-117.6 21.1c59.2-77-28.7-164.9-105.7-105.7-59.2 77 28.7 164.9 105.7 105.7zm243.4 182.7l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0l8.2-14.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zM501.6 431c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.6-82.4 14.3-52.8 52.8z"></path>
      </svg>
    ),
    iconClasses:
      "rounded-full p-3 text-3xl shrink-0 text-purple-500 dark:text-[#60A5FA] bg-transparent",
    containerClasses:
      "flex items-start gap-4 min-h-[140px] p-6 rounded-xl border text-[#1E40AF] shadow-none bg-transparent",
    title: "Compatibilidade",
    description:
      "Nossos plugins são compatíveis com BungeeCord, Velocity (Suporte recente) e Spigot. Desde a versão 1.8.8 do Minecraft, mantemos compatibilidade contínua, acompanhando cada atualização para garantir uma experiência estável e atualizada para todos os servidores.",
  },
  {
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"></path>
      </svg>
    ),
    iconClasses:
      "rounded-full p-3 text-3xl shrink-0 text-purple-500 dark:text-[#C084FC] bg-transparent",
    containerClasses:
      "flex items-start gap-4 min-h-[140px] p-6 rounded-xl border text-[#6B21A8] shadow-none bg-transparent",
    title: "Segurança e Melhorias",
    description:
      "Com atualizações constantes, nossos plugins oferecem correções, melhorias de desempenho e novos recursos, trazendo, assim, estabilidade e inovação para o seu servidor.",
  },
  {
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 640 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
      </svg>
    ),
    iconClasses:
      "rounded-full p-3 text-3xl shrink-0 text-purple-500 dark:text-[#FBBF24] bg-transparent",
    containerClasses:
      "flex items-start gap-4 min-h-[140px] p-6 rounded-xl border text-[#92400E] shadow-none bg-transparent",
    title: "Atendimento",
    description:
      "Nosso atendimento é o mais rápido do mercado. Com uma equipe eficiente de segunda a sexta-feira (com exceções nos finais de semana), atendemos clientes com prioridade, garantindo agilidade em cada atendimento.",
  },
];



interface AboutCardProps {
  icon: React.ReactNode;
  iconClasses?: string;
  title: string;
  description: string;
  containerClasses?: string;
}

const AboutCard: React.FC<AboutCardProps> = ({
  icon,
  iconClasses = "",
  title,
  description,
  containerClasses = "",
}) => (
  <div className={containerClasses} style={{ opacity: 1, transform: "none" }}>
    <div className={iconClasses}>{icon}</div>
    <div className="flex flex-col justify-between">
      <h3 className="text-xl font-semibold mb-1">
        <span className="text-white bg-clip-text">{title}</span>
      </h3>
      <p className="text-[15px] text-white">{description}</p>
    </div>
  </div>
);

interface PartnerLogoProps {
  src: string;
  alt: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => (
  <div className="bg-transparent rounded-full px-2 py-4 flex justify-center" style={{ opacity: 1 }}>
    <img
      src={src}
      alt={alt}
      className="w-10 h-10 sm:w-20 sm:h-20 rounded-full transition-all duration-300 hover:brightness-90 cursor-pointer"
    />
  </div>
);

const About = () => (
  <div className="w-full" id="about">
    <div className="container mx-auto max-w-7xl px-4 mb-10  md:px-8">
      <div
        className="max-w-4xl md:mx-auto text-center"
        style={{ opacity: 1, transform: "none" }}
      >
        <h2 className="text-[25px] sm:text-xl md:text-3xl lg:text-5xl font-bold text-white mb-4 leading-snug">
          Por que a{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Lothus Plugins
          </span>
          ?
        </h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10">
          Inovando o mercado de plugins premium para Minecraft com qualidade e confiança.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mx-auto">
        {aboutCards.map((card, i) => (
          <AboutCard key={i} {...card} />
        ))}
      </div>
    </div>
  </div>
);

export default About;