"use client"

import { useState } from "react";
import { deleteClosedDay } from "@/lib/actions/createClosedDay";

export default function DeleteClosedDay({
  closedDayId,
} : {
  closedDayId: number;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!confirm("Remove this closed day?")) return;

    setPending(true);
    setError("");

    const result = await deleteClosedDay(closedDayId);

    setPending(false);

    if(!result.ok){
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={pending}>
        {pending ? "Removing..." : "Remove"}
      </button>
      {error && <span>{error}</span>}
    </>
  )
}