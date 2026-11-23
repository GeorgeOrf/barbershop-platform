import BookingsView from "@/components/admin/BookingsView";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { resolveDay } from "@/lib/day";

export default async function StaffContent({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const current = await getCurrentBarber();
    if (!current) redirect("/login");

    const { date } = await searchParams;

    return <BookingsView barberId={current.id} day={resolveDay(date)} />;
}