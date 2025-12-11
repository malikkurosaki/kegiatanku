import  DateHolidays  from 'date-holidays'
const hd = new DateHolidays("ID")


/* ----------------------------------------------------------
   Types
----------------------------------------------------------- */
export type PersonName = string;

export interface ScheduleMap {
    [day: number]: PersonName | null;
}

export interface GetImamIkomahParams {
    names: PersonName[];
    year: number;
    month: number;
    keyImam: string;
    keyIkomah: string;
    liburTetap?: string[];       // contoh: ["sabtu", "minggu"]
    liburNasional?: string[];    // contoh: ["2025-05-17"]
}

export interface GetForDateParams {
    names: PersonName[];
    date: string | Date;
    keyImam: string;
    keyIkomah: string;
    liburTetap?: string[];
    liburNasional?: string[];
}

/* ----------------------------------------------------------
   Deterministic Seeded PRNG (Mulberry32)
----------------------------------------------------------- */
export function seededPRNG(seed: string): () => number {
    let s = 0;
    for (let i = 0; i < seed.length; i++) {
        s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return function () {
        s += 0x6D2B79F5;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ----------------------------------------------------------
   Seeded Fisher–Yates Shuffle
----------------------------------------------------------- */
export function deterministicShuffle<T>(array: T[], seed: string): T[] {
    const prng = seededPRNG(seed);
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [arr[i] as T, arr[j] as T] = [arr[j] as T, arr[i] as T];
    }

    return arr;
}

/* ----------------------------------------------------------
   Utility: cek apakah hari adalah libur tetap (berdasarkan nama hari)
----------------------------------------------------------- */
function isFixedHoliday(
    year: number,
    month: number,
    day: number,
    liburTetap: string[]
): boolean {
    const dayIndex = new Date(year, month - 1, day).getDay(); // 0=Min,6=Sab
    const map: Record<number, string> = {
        0: "minggu",
        1: "senin",
        2: "selasa",
        3: "rabu",
        4: "kamis",
        5: "jumat",
        6: "sabtu",
    };

    const nama = map[dayIndex];
    return liburTetap.includes(nama as string);
}

/* ----------------------------------------------------------
   Utility: cek libur nasional
----------------------------------------------------------- */
function isNationalHoliday(
    year: number,
    month: number,
    day: number,
    liburNasional?: string[]
): boolean {
    if (!liburNasional) return false;

    const d = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
    )}`;

    return liburNasional.includes(d);
}

/* ----------------------------------------------------------
   Generate imam + ikomah schedule with holidays
----------------------------------------------------------- */
export function getImamIkomahSchedule({
    names,
    year,
    month,
    keyImam,
    keyIkomah,
    liburTetap = ["sabtu", "minggu"],
    liburNasional = [],
}: GetImamIkomahParams) {
    const imamList = deterministicShuffle(names, `${year}-${month}-${keyImam}`);
    const ikomahList = deterministicShuffle(names, `${year}-${month}-${keyIkomah}`);

    const daysInMonth = new Date(year, month, 0).getDate();

    const imamSchedule: ScheduleMap = {};
    const ikomahSchedule: ScheduleMap = {};

    for (let day = 1; day <= daysInMonth; day++) {
        const isFixed = isFixedHoliday(year, month, day, liburTetap);
        const isNational = isNationalHoliday(year, month, day, liburNasional);

        if (isFixed || isNational) {
            imamSchedule[day] = null;
            ikomahSchedule[day] = null;
            continue;
        }

        const imam = imamList[(day - 1) % imamList.length];

        let ikomahIdx = (day - 1) % ikomahList.length;
        let ikomah = ikomahList[ikomahIdx];

        if (ikomah === imam) {
            ikomahIdx = (ikomahIdx + 1) % ikomahList.length;
            ikomah = ikomahList[ikomahIdx];
        }

        imamSchedule[day] = imam as string;
        ikomahSchedule[day] = ikomah as string;
    }

    return {
        imam: imamSchedule,
        ikomah: ikomahSchedule,
    };
}

/* ----------------------------------------------------------
   Get imam & ikomah for a specific date
----------------------------------------------------------- */
export function getForDate({
    names,
    date,
    keyImam,
    keyIkomah,
    liburTetap = ["sabtu", "minggu"],
    liburNasional = [],
}: GetForDateParams) {
    const d = typeof date === "string" ? new Date(date) : date;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const isFixed = isFixedHoliday(year, month, day, liburTetap);
    const isNational = isNationalHoliday(year, month, day, liburNasional);

    if (isFixed || isNational) {
        return { imam: null, ikomah: null };
    }

    const full = getImamIkomahSchedule({
        names,
        year,
        month,
        keyImam,
        keyIkomah,
        liburTetap,
        liburNasional,
    });

    return {
        imam: full.imam[day],
        ikomah: full.ikomah[day],
    };
}


if (import.meta.main) {
    const holiday = hd.getHolidays("2025")
    const names = ["jun", "malik", "bagas", "nico", "keano"];

    const liburNasional = [...holiday.map((h) => h.date)];
    const liburTetap = ["sabtu", "minggu"]; // bisa ditambah seperti: ["jumat"]

    const jadwal = getImamIkomahSchedule({
        names,
        year: 2025,
        month: 8,
        keyImam: "sdrtfsdrty",
        keyIkomah: "dfdfdfdfdf",
        liburTetap,
        liburNasional,
    });

    console.log(jadwal);

    console.log(
        getForDate({
            names,
            date: "2025-06-16",
            keyImam: "sdrtfsdrta",
            keyIkomah: "dfdfdfdfdf",
            liburTetap,
            liburNasional,
        })
    );

}
