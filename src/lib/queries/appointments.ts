
import { prisma } from "../prisma";
import { fromZonedTime } from "date-fns-tz";

const TZ = "Europe/Athens";

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

  const start = fromZonedTime(`${day}T00:00:00`, TZ);

  const nextDay = new Date(`${day}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const nextDayString = nextDay.toISOString().slice(0, 10);
  
  const end = fromZonedTime(`${nextDayString}T00:00:00`, TZ);

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

export async function getBarbersDayBooking(barberId: number, day: string) {
  const start = fromZonedTime(`${day}T00:00:00`, TZ);

  const next = new Date(`${day}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = fromZonedTime(`${next.toISOString().slice(0, 10)}T00:00:00`, TZ);

  return prisma.appointment.findMany({
    where: {
      barberId,
      status: { not: "CANCELLED"},
      date: { gte: start, lt: end },
    },
    select: {
      id: true,
      date: true,
      durationMin: true,
      price: true,
      status: true,
      customer: { select: { name: true, phone: true }},
      service: { select: { name: true }},
    },
    orderBy: { date: "asc" },
  });
}