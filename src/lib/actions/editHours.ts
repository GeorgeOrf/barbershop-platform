"use server"

import { revalidatePath } from "next/cache"
import { getCurrentBarber } from "../get-session"
import { prisma } from "../prisma"

export async function editHours(dayOfWeek: number, open: string | null, close: string | null){
    const current = await getCurrentBarber();

    if(!current){
        return {ok: false, error: "Invalid barber."}
    }
    if(current.role !== "OWNER"){
        return {ok: false, error: "Not allowed."}
    }

    const isTime = (v: string | null) => v === null || /^\d{2}:\d{2}$/.test(v);

    const newOpen = open || null;
    const newClose = close || null;

    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 1 || dayOfWeek > 7) {
        return { ok: false, error: "Invalid day." };
    }
    if (!isTime(newOpen) || !isTime(newClose)) {
        return { ok: false, error: "Invalid time." };
    }
    if ((newOpen === null) !== (newClose === null)) {
        return { ok: false, error: "Set both open and close, or leave both empty." };
    }
    if (newOpen && newClose && newOpen >= newClose) {
        return { ok: false, error: "Closing time must be after opening time." };
    }
    

    try {
        await prisma.openingHours.update({
            data: {open: newOpen, close: newClose},
            where:  {dayOfWeek},
        });
    } catch(error){
        console.error(error);
        return {ok: false, error: "Could not update the hours."};
    }

    revalidatePath("/admin", "layout");
    return {ok: true};
}