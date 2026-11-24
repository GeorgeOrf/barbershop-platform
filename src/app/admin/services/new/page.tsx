import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import CreateServiceForm from "@/components/admin/CreateServiceForm";

async function NewServiceContent() {
    const current = await getCurrentBarber();

    if (!current) redirect("/login");
    if (current.role !== "OWNER") redirect("/admin");

    return <CreateServiceForm />;
}

export default function NewServicePage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <NewServiceContent />
        </Suspense>
    );
}