import { shop } from "@/config/shop.config"

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center items-center px-6">
      <h1 className="text-5xl font-bold md:text-7xl">{shop.name}</h1>
      <p className="text-3xl font-semibold md:text-5xl mt-4">{shop.tagline}</p>
      <a href="#services" className="mt-10 bg-white text-black p-5 rounded-lg transition duration-200 hover:border-black hover:scale-105">Δες τις υπηρεσίες</a>
    </section>
  )
}