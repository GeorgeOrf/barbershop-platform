import { getBarbersDayBooking } from "@/lib/queries/appointments";
import DatePicker from "./DatePicker";

const TZ = "Europe/Athens";

export default async function BookingsView({
    barberId,
    day,
}: {
    barberId: number;
    day: string;
}) {
    const bookings = await getBarbersDayBooking(barberId, day);

    return (
        <>
            <DatePicker value={day} />
            {bookings.length === 0 ? (
                <p>No bookings on this day</p>
            ) : (
                <ul>
                    {bookings.map((b) => (
                        <li key={b.id}>
                            {b.date.toLocaleTimeString("el-GR", {
                                timeZone: TZ,
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            - {b.customer.name} ({b.customer.phone}) -{" "}
                            {b.service.name}, {b.durationMin} min,{" "}
                            {Number(b.price)}€
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}