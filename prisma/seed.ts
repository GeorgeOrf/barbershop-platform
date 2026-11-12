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
        durationMin: 30
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


//   const service = await prisma.service.findUnique({
//     where: { name: "Κούρεμα"},
//     select: {
//       id: true,
//       price: true,
//       durationMin: true,
//     }    
//   });

//   if(!service) {
//     throw new Error("Service not found");
//   }

//   await prisma.appointment.createMany({
//     data: {
//       serviceId:  service.id,
//       customerId: 1,
//       barberId: 1,
//       date: new Date("2026-11-12T10:30:00"),
//       status: "CONFIRMED",
//       price: service.price,
//       durationMin: service.durationMin
//     },
//     skipDuplicates: true,
//   });

  await prisma.service.update({
    where: {
      id: 2,
    },
    data: {
      durationMin: 30,
    },
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
