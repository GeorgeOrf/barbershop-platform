import { fetchHours } from "@/lib/queries/hours";

  const dayNames = [
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
  "Κυριακή",
  ];

export default async function Hours() {

  const openingHours = await fetchHours();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-white">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Visit us
        </p>
        <h2 className="mt-3 text-3xl font-bold">
          Ωράριο Λειτουργίας
        </h2>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-white/15 bg-black">
        <table className="w-full text-left">
          <tbody className="divide-y divide-white/10">
            {openingHours
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((hours) => (
                <tr
                  key={hours.id}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-5 font-medium">
                    {dayNames[hours.dayOfWeek - 1]}
                  </td>

                  <td className="px-6 py-5 text-right">
                    {hours.open && hours.close ? (
                      <span className="text-white/80">
                        {hours.open} — {hours.close}
                      </span>
                    ) : (
                      <span className="text-white/40 uppercase text-xs tracking-widest">
                        Κλειστά
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
          
      </div>
    </div>
  );
}