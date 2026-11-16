"use server"

import { prisma } from "../prisma";
import { fromZonedTime } from "date-fns-tz";
import { getAvailableSlots } from "@/lib/queries/availability";

export async function createBooking(serviceId: number, barberId: number, date: string, timeSlot: string, name: string, phone: string, email?: string) {

  const customerName = name.trim();
  const customerPhone = phone.trim().replace(/\s+/g, "");
  const customerEmail = email?.trim() || null;

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

  const freeSlots = await getAvailableSlots(barberId, date);

  if(!freeSlots.includes(timeSlot)) {
    return { success: false, error: "Slot no longer available"};
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
    return { success: true, appointmentId: result.appointment.id };
  }catch(error){ 
    console.error("Error creating booking:", error);
    return {success: false, error: "Failed to create booking"};
  }
}