
import { prisma } from "../prisma";

export async function fetchServices() {
  const services = await prisma.service.findMany();
  return services;
}
