
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { getAllBarbers } from "@/lib/queries/barbers";

 async function BarbersContent() {
    const current = await getCurrentBarber();

    if(!current) redirect("/login");
    if (current.role !== "OWNER") redirect("/admin");

    const barbers = await getAllBarbers();

    return (
        <ul>
            {barbers.map((b) => (
                <li key={b.id}>
                    <Link href={`/admin/barbers/${b.id}/bookings`}>{b.name}</Link>
                </li>
            ))}
        </ul>
    );
}

export default function BarbersPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
        <BarbersContent/>
        </Suspense>
    );
}