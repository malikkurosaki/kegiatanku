import Elysia, { t } from "elysia";
import { prisma } from "../lib/prisma";
import { getForDate, getImamIkomahSchedule } from "../lib/jadwalImam";
import DateHolidays from "date-holidays";

import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale("id");

// Untuk Denpasar: Asia/Makassar (WITA)
const LOCAL_TZ = "Asia/Makassar";

const hd = new DateHolidays("ID");

/* ------------------------------------------------------------------
   Helper: standardize date (YYYY-MM-DD) untuk semua input
------------------------------------------------------------------- */
function normalize(dateStr: string) {
    return dayjs.tz(dateStr, LOCAL_TZ).format("YYYY-MM-DD");
}

/* ------------------------------------------------------------------
   MAIN ROUTER
------------------------------------------------------------------- */
const JadwalSholat = new Elysia({
    prefix: "/jadwal-sholat",
    tags: ["jadwal_sholat"],
})

    /* =============================================================
       BULANAN
    ============================================================= */
    .get(
        "/bulanan",
        async ({ query }) => {
            const { day, month, year } = query;

            const data = await sebulan(year, month);

            return {
                date: dayjs.tz(`${year}-${month}-${day}`, LOCAL_TZ).format("YYYY-MM-DD"),
                month,
                year,
                data,
            };
        },
        {
            query: t.Object({
                day: t.Number({ default: Number(dayjs().tz(LOCAL_TZ).format("DD")) }),
                month: t.Number({ default: Number(dayjs().tz(LOCAL_TZ).format("MM")) }),
                year: t.Number({ default: Number(dayjs().tz(LOCAL_TZ).format("YYYY")) }),
            }),
            detail: {
                summary: "Get jadwal imam sebulan",
                description: "mendapatkan jadwal imam dan ikomah sebulan",
            },
        }
    )

    /* =============================================================
       HARIAN
    ============================================================= */
    .get(
        "/hari",
        async ({ query }) => {
            const date = normalize(query.date); // fix date shift
            const data = await harian({ date, holidays: query.holidays });

            return { date, data };
        },
        {
            query: t.Object({
                date: t.String({
                    default: dayjs().tz(LOCAL_TZ).format("YYYY-MM-DD"),
                }),
                holidays: t.Array(t.String(), { default: [] }),
            }),
            detail: {
                summary: "Get jadwal imam sehari",
                description: "mendapatkan jadwal imam dan ikomah sehari",
            },
        }
    )

    /* =============================================================
       ADHAN — Waktu Solat
    ============================================================= */
    .get(
        "/adhan",
        ({ query }) => {
            const date = normalize(query.date);

            // Gunakan dayjs untuk membuat "midnight WITA"
            const baseDate = dayjs.tz(date + " 00:00", LOCAL_TZ).toDate();

            const coords = new Coordinates(query.latitude, query.longitude);
            const params = CalculationMethod.MoonsightingCommittee();

            const times = new PrayerTimes(coords, baseDate, params);

            const toLocal = (dt: Date) =>
                dayjs(dt).tz(LOCAL_TZ).format("HH:mm");

            return {
                date,
                latitude: query.latitude,
                longitude: query.longitude,
                timezone: LOCAL_TZ,
                adhan: {
                    fajr: toLocal(times.fajr),
                    sunrise: toLocal(times.sunrise),
                    dhuhr: toLocal(times.dhuhr),
                    asr: toLocal(times.asr),
                    maghrib: toLocal(times.maghrib),
                    isha: toLocal(times.isha),
                },
            };
        },
        {
            query: t.Object({
                date: t.String({
                    default: dayjs().tz(LOCAL_TZ).format("YYYY-MM-DD"),
                }),
                latitude: t.Number({ default: -8.6500 }),
                longitude: t.Number({ default: 115.2167 }),
            }),
            detail: {
                summary: "Get adhan",
                description: "mendapatkan adhan",
            },
        }
    )
    .get("/user-list", async () => {
        const user = await prisma.user.findMany();
        return {
            data: user,
        };
    }, {
        detail: {
            summary: "Get user list",
            description: "mendapatkan list user",
        },
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
    .get("/config", async () => {
        const config = await prisma.configs.findUnique({
            where: { id: "1" },
        });
        console.log(config);
        
        return {
            data: config,
        };
    }, {
        detail: {
            summary: "Get config",
            description: "mendapatkan config",
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

export default JadwalSholat;

/* ------------------------------------------------------------------
   FUNCTIONS
------------------------------------------------------------------- */
async function sebulan(year: number, month: number) {
    const user = await prisma.user.findMany({ where: { active: true } });
    const configs = await prisma.configs.findFirst();

    const names = user.map((u) => u.name || "");

    return getImamIkomahSchedule({
        liburTetap: ["sabtu", "minggu"],
        liburNasional: hd.getHolidays(year).map((h) => normalize(h.date)),
        names,
        year,
        month,
        keyImam: configs?.imamKey || "defaultImamKey",
        keyIkomah: configs?.ikomahKey || "defaultIkomahKey",
    });
}

async function harian({
    date,
    holidays,
}: {
    date: string;
    holidays?: string[];
}) {
    const user = await prisma.user.findMany({ where: { active: true } });
    const configs = await prisma.configs.findFirst();
    const names = user.map((u) => u.name || "");

    // libur nasional ≠ format acak → normalisasi dgn dayjs
    const liburNasional = [
        ...hd.getHolidays(date).map((h) => normalize(h.date)),
        ...(holidays || []).map((d) => normalize(d)),
    ];

    const liburTetap = ["sabtu", "minggu"];

    return getForDate({
        names,
        date,
        keyImam: configs?.imamKey || "defaultImamKey",
        keyIkomah: configs?.ikomahKey || "defaultIkomahKey",
        liburTetap,
        liburNasional,
    });
}
