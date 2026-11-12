
import { prisma } from "../prisma";
import { filterFreeSlots, generateSlots } from "../slots";
import { getBarbersAppointments } from "./appointments";

export default async function getAvaliableSlots(barberId: number, day: Date) {
  const jsDay = day.getDay();
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