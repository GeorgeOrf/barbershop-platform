"use server"

import { prisma } from "../prisma";
import { fromZonedTime } from "date-fns-tz";
import { getAvailableSlots } from "@/lib/queries/availability";

export async function createBooking(serviceId: number, barberId: number, date: string, timeSlot: string, name: string, phone: string, email?: string) {

  const customerName = name.trim();
  const customerPhone = phone
  .trim()
  .replace(/[\s-]/g, "")
  .replace(/^(\+30|0030)/, "");
  const customerEmail = email?.trim() || null;

  const MAX_DAYS_AHEAD = 30;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens" });
  const limit = new Date(`${today}T12:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + MAX_DAYS_AHEAD);
  const maxDate = limit.toISOString().slice(0, 10);

  if(!serviceId || !barberId || !date || !timeSlot || !customerName || !customerPhone) {
    return { success: false as const, error: "Missing fields" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  return { success: false as const, error: "Invalid date" };
  }

  if (!/^(69\d{8}|2\d{9})$/.test(customerPhone)) {
  return { success: false as const, error: "Invalid phone number" };
  }

  if (!/^\d{2}:\d{2}$/.test(timeSlot)) {
    return { success: false as const, error: "Invalid time slot"};
  }

  if (date < today) {
    return { success: false as const, error: "You can't make a booking for a past date!"};
  }

  if (date > maxDate) {
    return { success: false as const, error: "You can book only a month in advance!"};
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId, active: true },
    select: { price: true, durationMin: true}
  });

  if(!service) {
    return { success: false as const, error: "Service not found"};
  }

  const barber = await prisma.barber.findFirst({
    where: { id: barberId, active: true },
    select: {id: true},
  });

  if(!barber) {
    return { success: false as const, error: "Barber not found"};
  }

  const freeSlots = await getAvailableSlots(barberId, date);

  if(!freeSlots.includes(timeSlot)) {
    return { success: false as const, error: "Slot no longer available"};
  }

  const appointmentDate = fromZonedTime(`${date}T${timeSlot}:00`, "Europe/Athens");
  
  try{
    const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: customerPhone },
      create: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      update: {},
    });

    const appointment = await tx.appointment.create({
      data: {
        serviceId: serviceId,
        customerId: customer.id,
        barberId: barberId,
        date: appointmentDate,
        durationMin: service.durationMin,
        price: service.price,
      }
    });
    return { customer, appointment };
  });
    return { success: true as const, appointmentId: result.appointment.id };
  } catch (error) {
  if ((error as { code?: string }).code === "P2002") {
    return { success: false as const, error: "Slot no longer available" };
  }
  console.error("Error creating booking:", error);
  return { success: false as const, error: "Failed to create booking" };
}
}