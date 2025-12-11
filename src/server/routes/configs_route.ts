import Elysia, { t } from "elysia";
import { prisma } from "@/server/lib/prisma";

const Configs = new Elysia({
    prefix: "/configs",
    detail: { description: "Configs API", summary: "Configs API", tags: ["configs"] },
})
    .post("/update-allow-register", async ({ body }) => {
        const { allowRegister } = body
        await prisma.configs.update({
            where: { id: "1" },
            data: { allowRegister },
        })
        return { success: true, message: "Configs updated successfully", allowRegister }
    }, {
        body: t.Object({
            allowRegister: t.Boolean(),
        }),
        detail: {
            description: "Update configs",
            summary: "update configs",
        },
    })

export default Configs

