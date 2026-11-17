import { prisma } from "../prisma";

export async function fetchHours() {
  const openingHours = await prisma.openingHours.findMany();
  return openingHours;
}

export async function fetchDays() {
  const workingDays = await prisma.openingHours.findMany({
    select: {
      dayOfWeek: true,
    },
  });
  return workingDays;
}