"use client"

import { useState } from "react"
import { deleteService } from "@/lib/actions/services"

export default function DeleteService({
    serviceId
} : {
    serviceId: number;
}) {

    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    
        async function handleClick() {
            setPending(true);
            setError("");
    
            const result = await deleteService(serviceId);
    
            setPending(false);
    
            if(!result.ok) {
                setError(result.error ?? "Something went wrong.");
            }
        }
    return (
    <>
        <button type="button" onClick={handleClick} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
        </button>
        {error && <span>{error}</span>}
    </>
);
}