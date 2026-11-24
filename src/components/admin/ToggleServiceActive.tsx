"use client"

import { useState } from "react"
import { setServiceActive } from "@/lib/actions/services"

export default function ToggleServiceActive({
    serviceId,
    active,
} : {
    serviceId: number;
    active: boolean;
}) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    async function handleClick() {
        setPending(true);
        setError("");

        const result = await setServiceActive(serviceId, !active);

        setPending(false);

        if(!result.ok) {
            setError(result.error ?? "Something went wrong.");
        }
    }

    return (
        <>
            <button type="button" onClick={handleClick} disabled={pending}>
                {pending ? "..." : active ? "Deactivate" : "Activate"}
            </button>
        </>
    );
}