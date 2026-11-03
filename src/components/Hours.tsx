import { shop } from "@/config/shop.config"

export default function Hours() {
  return (
    <section className="max-w-5xl py-20 px-6 mx-auto">
      <h3 className="text-2xl font-bold">Πότε μπορείς να κουρευτείς;</h3>
      <div className="mt-10 flex justify-center">
        <table>
        {shop.hours.map((day) => (
          <div  key={day.day}>
            <th>{day.day}</th>
            <tr>{day.open}</tr>
            </div>
        ))}
        </table>
      </div>
    </section>
  );
}