"use server"
import { getCurrentBarber } from "../get-session";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

const TZ = "Europe/Athens";

function isDay(value: string) {
    return (
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime())
    );
}

export async function createClosedDay(
    startDate: string,
    endDate: string | null,
    barberId: number | null,
) {
    const current = await getCurrentBarber();

    if(!current){
        return {ok: false, error: "Invalid barber."}
    }
    if(current.role !== "OWNER"){
        return {ok: false, error: "Not allowed."}
    }

    const end = endDate || null;

    if (!isDay(startDate) || (end !== null && !isDay(end))) {
        return {ok: false, error: "Invalid date."};
    }

    if(end !== null && end < startDate) {
        return {ok: false, error: "End date can't be before the start date."};    
    }

    if(barberId !== null) {
        if (!Number.isInteger(barberId)){
            return {ok: false, error: "Invalid barber."};
        }
        const exists = await prisma.barber.findUnique({
            where: { id: barberId },
            select: { id: true },
        });
        if(!exists){
            return {ok: false, error: "Barber not found."};
        }
    }

    try {
        await prisma.closedDay.create({
            data: {
                startDate,
                endDate: end,
                barberId,
            }
        });
    } catch(error) {
        console.error(error);
        return {ok: false, error: "Could not create the closed day."};
    }

    const rangeStart = fromZonedTime(`${startDate}T00:00:00`, TZ);
    const lastDay = new Date(`${end ?? startDate}T00:00:00Z`);
    lastDay.setUTCDate(lastDay.getUTCDate() + 1);
    const rangeEnd = fromZonedTime(
        `${lastDay.toISOString().slice(0, 10)}T00:00:00`,
        TZ
    );

    const affected = await prisma.appointment.count({
        where: {
            status: { not: "CANCELLED" },
            date: { gte: rangeStart, lt: rangeEnd },
            ...(barberId !== null ? { barberId } : {}),
        },
    });

    revalidatePath("/admin", "layout");
    return {ok: true, affected};
}

export async function deleteClosedDay(closedDayId: number) {
    const current = await getCurrentBarber();

    if (!current) {
        return { ok: false, error: "Invalid barber." };
    }
    if (current.role !== "OWNER") {
        return { ok: false, error: "Not allowed." };
    }
    if (!Number.isInteger(closedDayId)) {
        return { ok: false, error: "Invalid request." };
    }

    try {
        await prisma.closedDay.delete({ where: { id: closedDayId } });
    } catch (error) {
        console.error(error);
        return { ok: false, error: "Could not delete the closed day." };
    }

    revalidatePath("/admin", "layout");
    return { ok: true };
}