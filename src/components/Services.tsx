import { shop } from "@/config/shop.config"

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl font-bold">Οι Υπηρεσίες μας</h2>
      <div className="mt-10 grid gap-6 md:grip-cols-2">
        {shop.services.map((service) => (
          <div
          key={service.id}
          className="rounded-lg border border-white/10 p-8 transition hover:border-primary">
            <div className="flex items-baseline justify-between gap-8">
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <span className="text-xl font-bold text-primary">{service.price}</span>
            </div>
            {service.description && (
              <p className="mt-2 text-white/70">{service.description}</p>
            )}
            <p className="mt-4 text-sm text-white/50">{service.durationMin} λεπτά</p>
          </div>
        ))}
      </div>
    </section>
  );
}