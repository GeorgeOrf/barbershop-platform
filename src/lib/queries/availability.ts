
import { prisma } from "../prisma";

import { filterFreeSlots, generateSlots } from "../slots";
import { getBarbersAppointments } from "./appointments";

export async function getAvailableSlots(barberId: number, day: string) {
  const jsDay = new Date(`${day}T12:00:00Z`).getUTCDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;

  const openingHours = await prisma.openingHours.findUnique({
    where: { dayOfWeek },
  });

  if (!openingHours || !openingHours.open || !openingHours.close){
    return [];
  }

  const slots = generateSlots(openingHours.open, openingHours.close);

  const appointments = await getBarbersAppointments(barberId, day);
  const takenDates = appointments.map((appointment) => appointment.date);
  
  return filterFreeSlots(slots, takenDates);
}