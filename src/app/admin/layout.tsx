import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import Link from "next/link";
import SignOutButton from "./sign-out-button";

async function AuthGate({ children }: { children: React.ReactNode }) {
    const barber = await getCurrentBarber();

    if (!barber) {
        redirect("/login");
    }

     return (
        <>
            <nav>
                {barber.role === "OWNER" && (
                    <div className="flex gap-6">
                        <Link href="/admin/barbers">Barbers</Link>
                        <Link href="/admin/services">Services</Link>
                        <Link href="/admin/schedule">Schedule</Link>
                    </div>
                )}{" "}
                <div className="flex gap-6">
                    <Link href="/admin/staff">My bookings</Link>{" "}
                    <span>{barber.name}</span> <SignOutButton />
                    <Link href="/admin/bookings/new">Create new booking</Link>
                </div>
            </nav>
            {children}
        </>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AuthGate>{children}</AuthGate>
        </Suspense>
    );
}