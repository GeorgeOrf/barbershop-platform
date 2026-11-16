
import { prisma } from "../prisma";
import { fromZonedTime } from "date-fns-tz";

export async function getAppointments() {
  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
      barber: true,
      service: true,
    }
  });
  return appointments;
}

export async function getBarbersAppointments(barberId: number, day: string) {

  const start = fromZonedTime(`${day}T00:00:00`, "Europe/Athens");

  const nextDay = new Date(`${day}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const nextDayString = nextDay.toISOString().slice(0, 10);
  
  const end = fromZonedTime(`${nextDayString}T00:00:00`, "Europe/Athens");

  const barbersAppointments = await prisma.appointment.findMany({
    where: {
      barberId,
      status: {
        not: "CANCELLED",
      },
      date: {
        gte: start,
        lt: end,
      },
    },
    select: {
      id: true,
      date: true,
      durationMin: true,
      price: true,
    },
    orderBy: {
      date: "asc",
    }
  });
  return barbersAppointments;
}