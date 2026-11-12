"use server"

import { prisma } from "../prisma";
import getAvaliableSlots from "../queries/avaliability";

export async function createBooking(serviceId: number, barberId: number, date: string, timeSlot: string, name: string, phone: string) {

  const customerName = name.trim();
  const customerPhone = phone.trim();

  if(!serviceId || !barberId || !date || !timeSlot || !customerName || !customerPhone) {
    return { success: false, error: "Missing fields"};
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { price: true, durationMin: true}
  });

  if(!service) {
    return { success: false, error: "Service not found"};
  }

  const freeSlots = await getAvaliableSlots(barberId, new Date(date));

  if(!freeSlots.includes(timeSlot)) {
    return { success: false, error: "Slot no longer available"};
  }

  const appointmentDate = new Date(`${date}T${timeSlot}:00`);
}