"use client"

import { useState } from "react";
import { createClosedDay } from "@/lib/actions/createClosedDay";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateClosedDayForm({
  barbers,
}: {
  barbers: { id: number; name: string }[];
}) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const startDate = String(formData.get("start"));
    const endDate = String(formData.get("end"));
    const barberValue = String(formData.get("barber"));
    const barberId = barberValue === "" ? null : Number(barberValue);

    setPending(true);
    setMessage("");

    const result = await createClosedDay(startDate, endDate, barberId);

    setPending(false);

    if (result.ok) {
      if (result.affected && result.affected > 0) {
        setDone(true);
        setMessage(
          `Saved. ${result.affected} existing booking(s) fall in this period, cancel them manually.`
        );
      } else {
        router.push("/admin/schedule");
      }
    } else {
      setMessage(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="new-start">Start date:</label>
        <input type="date" id="new-start" name="start" required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="new-end">End date (optional):</label>
        <input type="date" id="new-end" name="end" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="new-barber">Who is off:</label>
        <select id="new-barber" name="barber" defaultValue="">
          <option value="">Whole shop</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending || done}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/schedule">{done ? "Back" : "Cancel"}</Link>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}