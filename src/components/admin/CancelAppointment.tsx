"use client"

import { cancelAppointment } from "@/lib/actions/appointments"
import { useState } from "react"

export default function CancelButton({
    appointmentId,
} : {
    appointmentId: number;
}) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    async function handleClick() {
        if (!confirm("Cancel this booking?")) return;

        setPending(true);
        setError("");

        const result = await cancelAppointment(appointmentId);

        setPending(false);

        if(!result.ok) {
            setError(result.error ?? "Something went wrong.");
        }
    }

    return (
        <>
            <button onClick={handleClick} disabled={pending}>
                {pending ? "Cancelling..." : "Cancel"}
            </button>
            {error && <span>{error}</span>}
        </>
    );
}
