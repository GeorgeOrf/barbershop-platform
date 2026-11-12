
import { prisma } from "../prisma";

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

export async function getBarbersAppointments(barberId: number, day: Date) {

  const start = new Date(day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

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