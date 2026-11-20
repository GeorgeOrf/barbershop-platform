import { shop } from "@/config/shop.config";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-6 p-4">
        <span className="texl-xl font-bold text-primary"><Link href="/">{shop.name}</Link></span>
        <ul className="hidden gap-6 md:flex">
          <li><Link href="/#services">Υπηρεσίες</Link></li>
          <li><Link href="/#barbers">Barbers</Link></li>
          <li><Link href="/#hours">Ωράριο</Link></li>
        </ul>
        <Link href="/booking" className="rounded bg-primary px-4 py-2 font-semibold text-black">Κλείσε Ραντεβού</Link>
      </nav>
    </header>
  );
}