"use server"
import { getCurrentBarber } from "../get-session"
import { prisma } from "../prisma"
import { revalidatePath } from "next/cache"


export async function cancelAppointment(appointmentId: number) {

    if(!Number.isInteger(appointmentId)){
        return { ok: false, error: "Invalid appointment."}
    }

    const currentBarber = await getCurrentBarber();
    if(!currentBarber) {
        return {ok: false, error: "Couldn't find barber."}
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: { id: true, barberId: true, status: true, },
    });

    if(!appointment){
        return {ok: false, error: "Appointment doesn't exist."}
    }

    if(appointment.barberId !== currentBarber.id && currentBarber.role !== "OWNER"){
        return {ok: false, error: "Not allowed."}
    }

    if(appointment.status === "CANCELLED"){
        return {ok: true}
    }

    await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED"}
    });

    revalidatePath("/admin", "layout");
    return {ok: true};
}