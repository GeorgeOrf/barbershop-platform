"use server"

import { revalidatePath } from "next/cache";
import { getCurrentBarber } from "../get-session";
import { prisma } from "../prisma";

export async function editService(serviceId: number, name: string, description: string, price: number, durationMin: number) {
    const cleanName = name.trim();
    const cleanDescription = description.trim() || null;

    if (!Number.isInteger(serviceId)) {
    return { ok: false, error: "Invalid service." };
    }

    if (!cleanName) {
        return { ok: false, error: "Name is required." };
    }

    if (!Number.isFinite(price) || price < 0) {
        return { ok: false, error: "Invalid price." };
    }

    if (!Number.isInteger(durationMin) || durationMin <= 0) {
        return { ok: false, error: "Invalid duration." };
    }

    const current = await getCurrentBarber();

    if(!current){
        return {ok: false, error: "Invalid barber."}
    }

    if(current.role !== "OWNER") {
        return {ok: false, error: "Not allowed."}
    }

    try {
        
    await prisma.service.update({
        where: { id: serviceId},
        data: {
            name: cleanName,
            description: cleanDescription,
            price: Math.round(price * 100) / 100,
            durationMin: durationMin,
        },
    });

    } catch (error) {
       console.error(error);
       return { ok: false, error: "Could not update the service." }  
    }


    revalidatePath("/admin", "layout");
    return {ok: true};
}