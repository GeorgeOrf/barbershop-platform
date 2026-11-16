"use server" 
import { getAvailableSlots } from "@/lib/queries/availability";

export async function fetchFreeSlots(barberId: number, day: string) {
    const freeSlots = await getAvailableSlots(barberId, day);
    return freeSlots;
}