import Elysia, { t } from "elysia";
import { prisma } from "../lib/prisma";

export const JadwalShalatAdmin = new Elysia({
    prefix: "/jadwal-sholat-admin",
    tags: ["jadwal_sholat_admin"],
})
    .put("/user-active", async ({ body }) => {

        const { id } = body;
        const user = await prisma.user.update({
            where: { id },
            data: { active: body.active },
        });
        return {
            success: true,
            data: user,
        };
    }, {
        body: t.Object({
            id: t.String(),
            active: t.Boolean(),
        }),
        detail: {
            summary: "Active user",
            description: "mengaktifkan user",
        },
    })
    .put("/config", async ({ body }) => {
        const { imamKey, ikomahKey } = body;
        const config = await prisma.configs.update({
            where: { id: "1" },
            data: { imamKey, ikomahKey },
        });
        console.log({
            success: true,
            config,
        });
        return {
            success: true,
            data: config,
        };
    }, {
        body: t.Object({
            id: t.String(),
            imamKey: t.String(),
            ikomahKey: t.String(),
        }),
        detail: {
            summary: "Update config",
            description: "mengupdate config",
        },
    });
