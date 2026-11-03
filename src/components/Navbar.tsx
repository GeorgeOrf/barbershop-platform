import { shop } from "@/config/shop.config";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-6 p-4">
        <span className="texl-xl font-bold text-primary">{shop.name}</span>
        <ul className="hidden gap-6 md:flex">
          <li><a href="#services">Υπηρεσίες</a></li>
          <li><a href="#barbers">Barbers</a></li>
          <li><a href="#hours">Ωράριο</a></li>
        </ul>
        <a href={`tel:${shop.phone}`} className="rounded bg-primary px-4 py-2 font-semibold text-black">Κλείσε Ραντεβού</a>
      </nav>
    </header>
  );
}