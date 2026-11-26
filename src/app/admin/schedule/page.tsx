import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import Link from "next/link";
import { fetchHours} from "@/lib/queries/hours";
import EditHoursForm from "@/components/admin/EditHoursForm";
import { fetchUpcomingClosedDays } from "@/lib/queries/closedDays";
import DeleteClosedDay from "@/components/admin/DeleteClosedDay";

const dayNames = [
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
  "Κυριακή",
  ];

async function ScheduleContent() {
    const current = await getCurrentBarber();

    if(!current) redirect("/login");
    if(current.role !==  "OWNER") redirect("/admin");

    const hours = await fetchHours();

    return (
        <>
            <ul>
                {hours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((h) => (
                        <li key={h.id}>
                            <span>{dayNames[h.dayOfWeek - 1]}</span>
                            <EditHoursForm 
                            hours={{
                                id: h.id,
                                dayOfWeek: h.dayOfWeek,
                                open: h.open,
                                close: h.close,
                            }}/>
                        </li>
                ))}
            </ul>
        </>
    );
}

async function DaysOffContent() {
    const current = await getCurrentBarber();

    if (!current) redirect("/login");
    if (current.role !== "OWNER") redirect("/admin");

    const days = await fetchUpcomingClosedDays();

    return (
        <>
            <Link href="/admin/schedule/closed-days/new">Close days</Link>
            {days.length === 0 ? (
                <p>No upcoming closed days.</p>
            ) : (
                <ul>
                    {days.map((d) => (
                        <li key={d.id}>
                            <span>
                                {d.endDate ? `${d.startDate} - ${d.endDate}` : d.startDate}
                            </span>
                            <span>
                                {d.barberId ? `${d.barber?.name} is off` : "Whole shop closed"}
                            </span>
                            <DeleteClosedDay closedDayId={d.id} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default function HoursPage() {
    return (
        <p>
            <Suspense fallback={<p>Loading...</p>}>
                <ScheduleContent/>
            </Suspense>
    
            <Suspense fallback={<p>Loading...</p>}>
                <DaysOffContent/>
            </Suspense>
        </p>

    );
}