
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";

async function AuthGate({ children }: { children: React.ReactNode }) {
    const barber = await getCurrentBarber();

    if (!barber) {
        redirect("/login");
    }

    return <>{children}</>;
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