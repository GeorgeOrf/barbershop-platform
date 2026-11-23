import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import SignOutButton from "./sign-out-button";

async function AdminContent() {
    const barber = await getCurrentBarber();

    if (!barber) {
        redirect("/login");
    }

    return (
        <p>
            Hello {barber.name}, your role is {barber.role}
            <SignOutButton/>
        </p>
    );
}

export default function Admin() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AdminContent />
        </Suspense>
    );
}