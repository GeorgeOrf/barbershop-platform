import { prisma } from "../prisma";

export async function fetchHours() {
  const openingHours = await prisma.openingHours.findMany();
  return openingHours;
}