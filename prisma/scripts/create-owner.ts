import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { processFetch } from "next/dist/client/components/router-reducer/fetch-server-response";

const { OWNER_NAME, OWNER_EMAIL, OWNER_PASSWORD } = process.env;

if (!OWNER_NAME || !OWNER_EMAIL || !OWNER_PASSWORD) {
    console.error("Set OWNER_NAME, OWNER_EMAIL and OWNER_PASSWORD first.");
    process.exit(1);
}

const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
});

const main = async () => {
    const owner = await prisma.barber.findFirst({
        where: { role: "OWNER"}
    });
    if(!owner) throw new Error("No OWNER barber found in the database.");
    if(owner.userId) {
        console.log("Owner already has an account. Nothing to do.");
        return;
    }

let userId: string;
const existing = await prisma.user.findUnique({
    where: { email: OWNER_EMAIL},
});

if (existing) {
    userId = existing.id;
} else {
    const result = await auth.api.signUpEmail({
        body: { name: OWNER_NAME, email: OWNER_EMAIL, password: OWNER_PASSWORD},
    });
    userId = result.user.id;
}

await prisma.barber.update({
    where: { id: owner.id},
    data: { userId },
});

console.log(`Owner account ready for ${OWNER_EMAIL}`);
};

main()
.catch((err) => {
    console.error(err);
    process.exit(1);
})
.finally(() => prisma.$disconnect());

