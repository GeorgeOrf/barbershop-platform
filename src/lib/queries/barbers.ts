import { prisma } from "../prisma";
import { Suspense } from "react";

export async function fetchBarbers() {
    const barbers =  await prisma.barber.findMany();
    return barbers;
}