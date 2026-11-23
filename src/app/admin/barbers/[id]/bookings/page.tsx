
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { resolveDay } from "@/lib/day";
import BookingsView from "@/components/admin/BookingsView";

async function BookingsContent({
    params,
    searchParams,
}: {
    params: Promise<{ id: string}>;
    searchParams: Promise< {date?: string}>;
}) {
    const { id } = await params;
    const barberId = Number(id);

    if (!Number.isInteger(barberId)) notFound();

    const current = await getCurrentBarber();
    if(!current) redirect("/login");

    if(current.role !== "OWNER" && current.id !== barberId){
        redirect("/admin");
    }

    const { date } = await searchParams;

    return <BookingsView barberId={barberId} day={resolveDay(date)} />;
}

export default function BarberBookingsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ date?: string }>;
}) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <BookingsContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}