import { fetchBarbers } from "@/lib/queries/barbers";

export default async function Barbers() {

  const barbers = await fetchBarbers();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl font-bold">Οι barbers μας</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="rounded-lg border border-white/10 p-8 transition hover:border-primary"
          >
            <div className="flex flex-col justify-between px-20 gap-6 items-center">
              {barber.photo ? (
                <img 
                src={barber.photo}
                alt={barber.name}
                className="mx-auto h-40 w-40 rounded-full object-cover"/>
                ) : (
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white/10 text-4xl font-bold text-primary">{barber.name[0]}</div>
                )
              }
              <h3 className="text-2xl font-semibold">{barber.name}</h3>
              <p className="text-white/60">{barber.role}</p>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
}