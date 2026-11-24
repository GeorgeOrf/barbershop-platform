
import { prisma } from "../prisma";

export async function fetchAllServices() {
  const services = await prisma.service.findMany();
  return services;
}
