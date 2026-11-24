"use server"

import { revalidatePath } from "next/cache";
import { getCurrentBarber } from "../get-session";
import { prisma } from "../prisma";

function validateServiceInput(
    name: string,
    description: string,
    price: number,
    durationMin: number
) {
    const cleanName = name.trim();
    const cleanDescription = description.trim() || null;

    if (!cleanName) {
        return { ok: false as const, error: "Name is required." };
    }
    if (!Number.isFinite(price) || price < 0) {
        return { ok: false as const, error: "Invalid price." };
    }
    if (!Number.isInteger(durationMin) || durationMin <= 0) {
        return { ok: false as const, error: "Invalid duration." };
    }

    return {
        ok: true as const,
        data: {
            name: cleanName,
            description: cleanDescription,
            price: Math.round(price * 100) / 100,
            durationMin,
        },
    };
}


export async function createService(name: string, description: string, price: number, durationMin: number) {

    const current = await getCurrentBarber();

    if(!current){
        return {ok: false, error: "Invalid barber."}
    }

    if(current.role !== "OWNER") {
        return {ok: false, error: "Not allowed."}
    }

    const parsed = validateServiceInput(name, description, price, durationMin);
    if (!parsed.ok) return parsed;

    try {
        
    await prisma.service.create({
        data: parsed.data,
    });

    } catch (error) {
       console.error(error);
       return { ok: false, error: "Could not create the service." }  
    }

    revalidatePath("/admin", "layout");
    return {ok: true};

}


export async function editService(serviceId: number, name: string, description: string, price: number, durationMin: number) {
    
    const current = await getCurrentBarber();

    if(!current){
        return {ok: false, error: "Invalid barber."}
    }

    if(current.role !== "OWNER") {
        return {ok: false, error: "Not allowed."}
    }
    
    if (!Number.isInteger(serviceId)) {
    return { ok: false, error: "Invalid service." };
    }

    const parsed = validateServiceInput(name, description, price, durationMin);
    if (!parsed.ok) return parsed;

    try {
    await prisma.service.update({
        where: { id: serviceId},
        data: parsed.data,
    });

    } catch (error) {
       console.error(error);
       return { ok: false, error: "Could not update the service." }  
    }

    revalidatePath("/admin", "layout");
    return {ok: true};
}

export async function setServiceActive(serviceId: number, active: boolean) {
    const current = await getCurrentBarber();

    if (!current) {
        return { ok: false, error: "Invalid barber." };
    }
    if (current.role !== "OWNER") {
        return { ok: false, error: "Not allowed." };
    }
    if (!Number.isInteger(serviceId) || typeof active !== "boolean") {
        return { ok: false, error: "Invalid request." };
    }

    try {
        await prisma.service.update({
            where: { id: serviceId },
            data: { active },
        });
    } catch (error) {
        console.error(error);
        return { ok: false, error: "Could not update the service." };
    }

    revalidatePath("/admin", "layout");
    return { ok: true };
}

export async function deleteService(serviceId: number) {
    const current = await getCurrentBarber();

    if (!current) {
        return { ok: false, error: "Invalid barber." };
    }
    if (current.role !== "OWNER") {
        return { ok: false, error: "Not allowed." };
    }
    if (!Number.isInteger(serviceId)) {
        return { ok: false, error: "Invalid request." };
    }

    try {
        await prisma.service.delete({ where: { id: serviceId, active: false}});
    } catch (error) {
    const code = (error as { code?: string }).code;

    if (code === "P2003") {
        return {
            ok: false,
            error: "This service has bookings and can't be deleted. Keep it deactivated instead.",
        };
    }
    if (code === "P2025") {
        return { ok: false, error: "Service not found, or it's still active." };
    }

    console.error(error);
    return { ok: false, error: "Could not delete the service." };
}

    revalidatePath("/admin", "layout");
    return { ok: true };
}