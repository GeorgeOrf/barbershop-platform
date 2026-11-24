import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const { BARBER_NAME, BARBER_EMAIL, BARBER_PASSWORD, BARBER_ID } = process.env;

if (!BARBER_NAME || !BARBER_EMAIL || !BARBER_PASSWORD || !BARBER_ID) {
    console.error("Set BARBER_NAME, BARBER_EMAIL, BARBER_PASSWORD and BARBER_ID first.");
    process.exit(1);
}

const barberId = Number(BARBER_ID);
if (!Number.isInteger(barberId)) {
    console.error("Enter a valid BARBER_ID.");
    process.exit(1);
}

const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
});

const main = async () => {
    const barber = await prisma.barber.findUnique({
        where: { id: barberId},
    });
    if(!barber) throw new Error("No BARBER found in the database.");
    if(barber.userId) {
        console.log("Barber already has an account. Nothing to do.");
        return;
    }

    let userId: string;
    const existing = await prisma.user.findUnique({
        where: { email: BARBER_EMAIL},
    });

    if (existing) {
        userId = existing.id;
    } else {
        const result = await auth.api.signUpEmail({
            body: { name: BARBER_NAME, email: BARBER_EMAIL, password: BARBER_PASSWORD},
        });
        userId = result.user.id;
    }

    await prisma.barber.update({
        where: { id: barber.id},
        data: { userId },
    });

    console.log(`Barber account ready for ${BARBER_EMAIL}`);

};

main()
.catch((err) => {
    console.error(err);
    process.exit(1);
})
.finally(() => prisma.$disconnect());

