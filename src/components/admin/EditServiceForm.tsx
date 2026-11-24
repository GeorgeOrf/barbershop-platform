"use client"

import { useState } from "react"
import { editService } from "@/lib/actions/services"

type ServiceProp = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
};

export default function EditServiceForm({ service }: { service: ServiceProp}) {

    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState("");
    const [editing, setEditing] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const price = Number(formData.get("price"));
    const durationMin = Number(formData.get("durationMin"));

    setPending(true);
    setMessage("");

    const result = await editService(service.id, name, description, price, durationMin);

    setPending(false);
    
    if( result.ok ) {
        setMessage("Saved.");
        setEditing(false);
    } else {
        setMessage(result.error ?? "Something went wrong.");
    }

    }

    if (!editing) {
            return (
                <div>
                    <span>{service.name}</span>
                    <span>{service.description}</span>
                    <span>{service.price}€</span>
                    <span>{service.durationMin} min</span>
                    <button
                        type="button"
                        onClick={() => {
                            setMessage("");
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
        <form onSubmit={handleSubmit}>
            <label htmlFor={`name-${service.id}`}>Name:</label>
            <input type="text" id={`name-${service.id}`} name="name" defaultValue={service.name} />
            <label htmlFor={`description-${service.id}`}>Description:</label>
            <input type="text" id={`description-${service.id}`} name="description" defaultValue={service.description ?? ""} />
            <label htmlFor={`price-${service.id}`}>Price:</label>
            <input type="number" step={0.01} id={`price-${service.id}`} name="price" defaultValue={service.price} />
            <label htmlFor={`durationMin-${service.id}`}>Duration:</label>
            <input type="number" min={1} id={`durationMin-${service.id}`} name="durationMin" defaultValue={service.durationMin} />
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
            {message && <p>{message}</p>}
        </form>
    );
}

