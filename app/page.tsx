import About from "@/components/web/About";
import { Footer } from "@/components/web/Footer";
import { Header } from "@/components/web/Header";
import Hero from "@/components/web/Hero";
import { PluginsSection } from "@/components/web/Plugins";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Header />
    <Hero />
    <PluginsSection />
    <About />
    <Footer />
    </>
  );
}
