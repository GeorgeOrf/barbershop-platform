import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { getAllBarbers } from "@/lib/queries/barbers";
import CreateClosedDayForm from "@/components/admin/CreateClosedDayForm";

async function NewClosedDaysContent() {
    const current = await getCurrentBarber();

    if (!current) redirect("/login");
    if (current.role !== "OWNER") redirect("/admin");

    const barbers = await getAllBarbers();

    return <CreateClosedDayForm barbers={barbers} />;
}

export default function NewServicePage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <NewClosedDaysContent />
        </Suspense>
    );
}