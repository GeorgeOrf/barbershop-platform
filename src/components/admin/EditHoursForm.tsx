"use client"

import { useState } from "react"
import { editHours } from "@/lib/actions/editHours"

type HoursProp = {
    id: number;
    dayOfWeek: number;
    open: string | null;
    close: string | null;
}

const TIMES: string[] = Array.from(
    { length: 24 },
    (_, h) => `${String(h).padStart(2, "0")}:00`
);

export default function EditHoursForm({ hours }: { hours: HoursProp }) {
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [closed, setClosed] = useState(!hours.open || !hours.close);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const open = closed ? null : String(formData.get("open"));
        const close = closed ? null : String(formData.get("close"));

        setPending(true);
        setMessage("");

        const result = await editHours(hours.dayOfWeek, open, close);

        setPending(false);

        if (result.ok) {
            setMessage("Saved.");
            setEditing(false);
        } else {
            setMessage(result.error ?? "Something went wrong.");
        }
    }

    if (!editing) {
        return (
            <div className="flex items-center gap-4">
                <span>
                    {hours.open && hours.close
                        ? `${hours.open} – ${hours.close}`
                        : "Κλειστά"}
                </span>
                <button
                    type="button"
                    onClick={() => {
                        setMessage("");
                        setClosed(!hours.open || !hours.close);
                        setEditing(true);
                    }}
                >
                    Edit
                </button>
                {message && <p>{message}</p>}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={closed}
                    onChange={(e) => setClosed(e.target.checked)}
                />
                Κλειστά
            </label>

            <div className="flex gap-3">
                <div className="flex flex-col gap-1">
                    <label htmlFor={`open-${hours.id}`}>Open</label>
                    <select
                        id={`open-${hours.id}`}
                        name="open"
                        defaultValue={hours.open ?? "09:00"}
                        disabled={closed}
                    >
                        {TIMES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor={`close-${hours.id}`}>Close</label>
                    <select
                        id={`close-${hours.id}`}
                        name="close"
                        defaultValue={hours.close ?? "21:00"}
                        disabled={closed}
                    >
                        {TIMES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-3">
                <button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMessage("");
                        setEditing(false);
                    }}
                >
                    Cancel
                </button>
            </div>

            {message && <p>{message}</p>}
        </form>
    );
}