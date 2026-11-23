import { prisma } from "../prisma";

export async function fetchBarbers() {
    const barbers =  await prisma.barber.findMany({
        where: { active: true },
    });
    return barbers;
}

export async function getAllBarbers() {
    const allBarbers = await prisma.barber.findMany();
    return allBarbers;
}