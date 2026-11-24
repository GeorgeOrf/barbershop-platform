import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";

async function AdminContent() {
    const barber = await getCurrentBarber();

    if (!barber) {
        redirect("/login");
    }

    if(barber.role === "BARBER") {
        redirect("/admin/staff");
    }

    return (
        <>
        
        </>
    );
}

export default function Admin() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AdminContent />
        </Suspense>
    );
}