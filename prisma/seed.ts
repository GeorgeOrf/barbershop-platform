import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.service.createMany({
    data: [
      {
        name: "Κούρεμα",
        price: 15,
        durationMin: 30
      },
      {
        name: "Κούρεμα & Μούσια",
        price: 18,
        durationMin: 40
      },
      {
        name: "Παιδικό Κούρεμα",
        price: 10,
        durationMin: 30
      },
    ],
    skipDuplicates: true,
  });

  await prisma.barber.createMany({
    data: [
      {
        name: "Ηλίας",
        role: "OWNER",
      },
      {
        name: "Γιώργος",
        role: "BARBER",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.openingHours.createMany({
    data: [
      {dayOfWeek: 1, open: null, close: null},
      {dayOfWeek: 2, open: "10:00", close: "18:00"},
      {dayOfWeek: 3, open: "10:00", close: "18:00"},
      {dayOfWeek: 4, open: "10:00", close: "18:00"},
      {dayOfWeek: 5, open: "10:00", close: "18:00"},
      {dayOfWeek: 6, open: "10:00", close: "18:00"},
      {dayOfWeek: 7, open: null, close: null},
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });