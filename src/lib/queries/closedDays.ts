import { prisma } from "../prisma";

export async function fetchUpcomingClosedDays() {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens" });

  return prisma.closedDay.findMany({
    where: {
      OR: [
        { endDate: { gte: today } },
        { endDate: null, startDate: { gte: today } },
      ],
    },
    select: { startDate: true, endDate: true, barberId: true },
  });
}