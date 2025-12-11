import { prisma } from "@/server/lib/prisma";
import { USER_ROLE } from "generated/prisma";

const user = [
    {
        name: "Bip",
        email: "wibu@bip.com",
        password: "Production_123",
        role: USER_ROLE.ADMIN
    },
    {
        name: "Jun",
        email: "jun@bip.com",
        password: "Production_123",
        role: USER_ROLE.USER
    },
    {
        name: "Malik",
        email: "malik@bip.com",
        password: "Production_123",
        role: USER_ROLE.USER
    },
    {
        name: "Bagas",
        email: "bagas@bip.com",
        password: "Production_123",
        role: USER_ROLE.USER
    },
    {
        name: "Nico",
        email: "nico@bip.com",
        password: "Production_123",
        role: USER_ROLE.USER
    },
    {
        name: "Keano",
        email: "keano@bip.com",
        password: "Production_123",
        role: USER_ROLE.USER
    }
];

const configs = {
    allowRegister: false,
    imamKey: "imam",
    ikomahKey: "ikomah"
}

    ; (async () => {
        for (const u of user) {
            await prisma.user.upsert({
                where: { email: u.email },
                create: { ...u },
                update: { ...u },
            })

            console.log(`✅ User ${u.email} seeded successfully`)
        }

        await prisma.configs.upsert({
            where: { id: "1" },
            create: configs,
            update: configs,
        })

        console.log(`✅ Configs seeded successfully`)
    })().catch((e) => {
        console.error(e)
        process.exit(1)
    }).finally(() => {
        console.log("✅ Seeding completed successfully ")
        process.exit(0)
    })

