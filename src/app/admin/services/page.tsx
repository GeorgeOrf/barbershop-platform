import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { fetchServices } from "@/lib/queries/services";
import EditServiceForm from "@/components/admin/EditServiceForm";
import Link from "next/link";

async function ServicesContent() {
    const current = await getCurrentBarber();

    if(!current) redirect("/login");
    if(current.role!== "OWNER") redirect("/admin");

    const services = await fetchServices();

    return (
        <>
        <Link href="/admin/services/new">Add service</Link>
            <ul>
                {services.map((s) => (
                    <li key={s.id}>
                        <div>
                            <EditServiceForm 
                            service={{
                                id: s.id,
                                name: s.name,
                                description: s.description,
                                price: Number(s.price),
                                durationMin: s.durationMin,
                            }}/>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ServicesContent/>
        </Suspense>
    )
}