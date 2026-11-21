import { prisma } from "../prisma";

export async function fetchBarbers() {
    const barbers =  await prisma.barber.findMany({
        where: { active: true },
    });
    return barbers;
}