
import { prisma } from "../prisma";

import { filterFreeSlots, generateSlots } from "../slots";
import { getBarbersAppointments } from "./appointments";

  const BUFFER_MINUTES = 30;

export async function getAvailableSlots(barberId: number, day: string) {
  const jsDay = new Date(`${day}T12:00:00Z`).getUTCDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;

  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens"});
  const cutoffDate = new Date(Date.now() + BUFFER_MINUTES * 60 * 1000);
  const cutoff = cutoffDate.toLocaleTimeString("sv-SE", {
    timeZone: "Europe/Athens",
    hour: "2-digit",
    minute: "2-digit"
  });

  const closedDay = await prisma.closedDay.findFirst({
    where: {
      OR: [{barberId: null}, { barberId }],
      startDate: { lte: day },
      AND: [
        { OR: [{ endDate: { gte: day } }, { startDate: day }] },
      ],
    },
    select: { id: true},
  });

  if(closedDay){
    return [];
  }

  const openingHours = await prisma.openingHours.findUnique({
    where: { dayOfWeek },
  });

  if (!openingHours || !openingHours.open || !openingHours.close){
    return [];
  }

  const slots = generateSlots(openingHours.open, openingHours.close);

  const appointments = await getBarbersAppointments(barberId, day);
  const takenDates = appointments.map((appointment) => appointment.date);
  
  const freeSlots = filterFreeSlots(slots, takenDates);

  if(day !== today) {
    return freeSlots;
  } else {
    return freeSlots.filter((slot) => slot >= cutoff);
  }
}