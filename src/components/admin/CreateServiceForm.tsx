"use client"

import { useState } from "react"
import { createService } from "@/lib/actions/services"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateServiceForm() {

    const router = useRouter();

    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("name"));
        const description = String(formData.get("description"));
        const price = Number(formData.get("price"));
        const durationMin = Number(formData.get("durationMin"));
    
        setPending(true);
        setMessage("");

        const result = await createService(name, description, price, durationMin);
    
        setPending(false);
        
        if( result.ok ) {
            router.push("/admin/services");
        } else {
            setMessage(result.error ?? "Something went wrong.");
        }
    
    }

        return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-name">Name:</label>
            <input type="text" id="new-name" name="name"/>
            <label htmlFor="new-description">Description:</label>
            <input type="text" id="new-description" name="description"/>
            <label htmlFor="new-price">Price:</label>
            <input type="number" step={0.01} id="new-price" name="price" />
            <label htmlFor="new-duration">Duration:</label>
            <input type="number" min={1} id="new-duration" name="durationMin"/>
            <button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
            </button>
            <Link href="/admin/services">Cancel</Link>
            {message && <p>{message}</p>}
        </form>
    );
}