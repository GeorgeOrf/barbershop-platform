"use server"
import { headers } from "next/headers"
import { auth } from "./auth"
import { prisma } from "./prisma";

export async function getCurrentBarber() {
    const session = await auth.api.getSession({ headers: await headers()});

    if(!session){
        return null;
    }

    const barber = await prisma.barber.findUnique({
        where: { userId: session.user.id },
        select: { id: true, name: true, role: true },
    });

    return barber;

}