import apiFetch from "@/lib/apiFetch";
import {
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/id";
import duration from "dayjs/plugin/duration";
import { useEffect, useMemo, useState } from "react";

import {
  IconCalendar,
  IconCalendarEvent,
  IconCalendarStar,
  IconClock,
  IconGift,
  IconLayoutGrid,
  IconMoon,
  IconSun,
  IconSunHigh,
  IconSunrise,
  IconSunset,
  IconUser,
} from "@tabler/icons-react";

import DateHolidays, { type HolidaysTypes } from "date-holidays";
import useSwr from "swr";
import { useNavigate } from "react-router";
import clientRoutes from "@/clientRoutes";
dayjs.locale("id");
dayjs.extend(duration);

export function formatCountdown(dt: dayjs.Dayjs | null) {
  if (!dt) return "-";

  const now = dayjs();
  const diff = dt.diff(now);

  if (diff <= 0) return "Sudah lewat";

  const dur = dayjs.duration(diff);

  return `${dur.hours()}j ${dur.minutes()}m`;
}

export default function AdhanPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [monthly, setMonthly] = useState<any>(null);
  const [daily, setDaily] = useState<any>(null);
  const [adhan, setAdhan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // tahun & bulan yang dipakai
  const year = dayjs(date).year();
  const month = dayjs(date).month() + 1;
  const selectedDateStr = dayjs(date).format("YYYY-MM-DD");

  // ambil data dari backend
  const fetchAll = async () => {
    setLoading(true);

    const bulan = await apiFetch.api["jadwal-sholat"].bulanan.get({
      query: {
        day: dayjs(date).date(),
        month,
        year,
      },
    });

    const hari = await apiFetch.api["jadwal-sholat"].hari.get({
      query: {
        date: selectedDateStr,
        holidays: [],
      },
    });

    const ad = await apiFetch.api["jadwal-sholat"].adhan.get({
      query: {
        date: selectedDateStr,
        latitude: -8.65,
        longitude: 115.2167,
      },
    });

    setMonthly(bulan.data);
    setDaily(hari.data);
    setAdhan(ad.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // generate holidays tahun ini (DateHolidays)
  const holidays = useMemo(() => {
    const hd = new DateHolidays("ID");
    return hd.getHolidays(year) || [];
  }, [year]);

  // helper: apakah tanggal tertentu (YYYY-MM-DD) merupakan hari libur?
  const isHoliday = (d: string) => {
    return holidays.some(
      (h) =>
        dayjs(h.date).format("YYYY-MM-DD") === dayjs(d).format("YYYY-MM-DD"),
    );
  };

  // ========== Calendar grid (month view) ==========
  // buat array days untuk bulan ini (1..n) + offset untuk memulai hari pada weekday yg benar
  const monthGrid = useMemo(() => {
    const first = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
    const daysInMonth = first.daysInMonth();
    const startWeekday = first.day(); // 0 = Sunday ... 6 = Saturday
    const cells: Array<{ date: dayjs.Dayjs | null }> = [];

    // fill leading blanks
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: null });
    }

    // fill actual days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: dayjs(
          `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        ),
      });
    }

    // fill trailing blanks to complete week rows (7 cols)
    while (cells.length % 7 !== 0) {
      cells.push({ date: null });
    }

    return { cells, daysInMonth, startWeekday };
  }, [year, month]);


  // ========== Prayer cards (per waktu) ==========
  const prayerList = useMemo(() => {
    // adhan.adhan is expected: { fajr, sunrise, dhuhr, asr, maghrib, isha }
    if (!adhan || !adhan.adhan) return [];
    const mapIcon: Record<string, any> = {
      fajr: IconSunrise,
      sunrise: IconSun,
      dhuhr: IconSunHigh ?? IconSun,
      asr: IconSun,
      maghrib: IconSunset ?? IconSun,
      isha: IconMoon,
    };

    return Object.entries(adhan.adhan).map(([key, timeStr]) => {
      // build full datetime for the selected date
      const dt = dayjs(`${selectedDateStr} ${timeStr}`, "YYYY-MM-DD HH:mm");
      const now = dayjs();
      const diffMs = dt.diff(now);
      const isPast = diffMs <= 0;
      const until = isPast
        ? null
        : dayjs.duration
          ? dayjs.duration(diffMs)
          : null; // dayjs duration optional
      return {
        name: key,
        time: timeStr,
        dt,
        isPast,
        until,
        Icon: mapIcon[key] ?? IconClock,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adhan, selectedDateStr]);

  // small util for countdown string
  const formatCountdown = (dt: dayjs.Dayjs) => {
    const now = dayjs();
    const diff = dt.diff(now);
    if (diff <= 0) return "Sudah lewat";
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `dalam ${hours}j ${mins}m`;
    return `dalam ${mins}m`;
  };

  // safety guards if data missing
  if (!monthly || !daily || !adhan) {
    return (
      <Container size="md" w="100%">
        <Stack gap="xl" py="md">
          <Skeleton height={20} radius="sm" />
          <Skeleton height={200} radius="md" />
          <Skeleton height={300} radius="md" />
        </Stack>
      </Container>
    );
  }

  const landscapeGradient =
    "linear-gradient(135deg, #091622ff, #475b71ff,  #706420ff, #0d3e0cff)";
  return (
    <Box w={"100%"} bg={landscapeGradient}>
      <Container size="md" w="100%" px="sm" >
        <Stack gap="xl" py="md">
          <Stack justify="apart" align="center">
            <Stack justify="center" align="center">
              <IconCalendar
                color="cyan"
                size={"6rem"}
                stroke={1.3}
                onClick={() => navigate("/")}
              />
              <Title order={2} fw={700}>
                Jadwal Sholat & Imam
              </Title>
              <Text size="xs" c="dimmed">
                {dayjs(date).locale("id").format("dddd, DD MMMM YYYY")}
              </Text>
            </Stack>
          </Stack>

          {JadwalHariIni(prayerList, formatCountdown)}

          <SimpleGrid cols={{
            base: 1,
            md: 2
          }}>
            {JadwalImamHariIni(date, daily, adhan)}
            <Card
              padding="lg"
              radius="md"
              bg={"linear-gradient(135deg, #614c34ff, #596c2fff)"}
            >
              <Stack gap="xs">
                <Group gap={6}>
                  <IconCalendarEvent size={"2rem"} />
                  <Text size="2rem" fw={700}>Pilih Tanggal</Text>
                </Group>
                <DatePicker
                  locale="id"
                  value={date}
                  // date={date || undefined}
                  renderDay={(d) => (
                    <Text
                      c={
                        dayjs(d).date() === dayjs(date).date()
                          ? "green"
                          : isHoliday(dayjs(d).format("YYYY-MM-DD"))
                            ? "red"
                            : ""
                      }
                    >
                      {dayjs(d).format("DD")}
                    </Text>
                  )}
                  minDate={dayjs("2025-01-01").toDate()}
                  maxDate={dayjs().add(40, "year").toDate()}
                  // defaultDate={date || undefined}
                  onChange={(date) => setDate(dayjs(date).toDate())}
                  onYearSelect={(year) => setDate(dayjs(year).toDate())}
                  onMonthSelect={(month) => setDate(dayjs(month).toDate())}

                />
              </Stack>
            </Card>
          </SimpleGrid>

          {CalendarTable(date, monthGrid, isHoliday, monthly, setDate, holidays)}

          {RingkasanBulalan(monthly, year, month, isHoliday)}
          {FullYearHoliday(year, holidays)}
        </Stack>
      </Container>
    </Box>
  );
}

function JadwalImamHariIni(date: Date | null, daily: any, adhan: any) {
  return (
    <Card padding="lg" radius="md" bg={"dark.9"}>
      <Stack gap="20">
        <Stack>
          <Group>
            <IconUser size={"2rem"} />
            <Text size="2rem" fw={700}>
              Jadwal Imam Hari Ini
            </Text>
          </Group>

          <Text size="sm" c="dimmed">
            {dayjs(date).format("dddd, DD MMMM YYYY")}
          </Text>
        </Stack>

        <Stack>
          <Stack gap={"xs"}>
            <Flex gap={"md"}>
              <IconUser size={"3rem"} />
              <Text fw={700} c={"teal"} size="3rem">{daily.data.imam || "-"}</Text>
            </Flex>
            <Text c={"dimmed"}>Imam</Text>
          </Stack>
          <Divider c={"green"} />
          <Stack gap={"xs"}>
            <Flex gap={"md"}>
              <IconClock size={"2rem"} />
              <Text c={"blue.4"} size="2rem">{daily.data.ikomah || "-"}</Text>
            </Flex>
            <Text c={"dimmed"}>Ikomah</Text>
          </Stack>
        </Stack>

        <Text size="1.5rem" fw={700}>Waktu Adhan</Text>
        <Stack gap={6} c={"dimmed"}>
          {Object.entries(adhan.adhan).map(([k, v]) => (
            <Group key={k} justify="apart">
              <Text w={100} style={{ textTransform: "capitalize" }}>
                {k}
              </Text>
              <Text fw={700}>{v as string}</Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

function CalendarTable(
  date: Date | null,
  monthGrid: {
    cells: { date: dayjs.Dayjs | null }[];
    daysInMonth: number;
    startWeekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  },
  isHoliday: (d: string) => boolean,
  monthly: any,
  setDate: any,
  holidays: HolidaysTypes.Holiday[],
) {
  return (
    <Card
      bg={"dark.9"}
      padding="md"
      radius="lg"
      shadow="sm"
      style={{
        overflowX: "scroll",
      }}
    >
      <Stack miw={700} gap="60">
        <Stack justify="apart" gap={6}>
          <Group>
            <IconLayoutGrid size={"2rem"} />
            <Text size={"2rem"} fw={700}>
              Kalender {dayjs(date).format("MMMM YYYY")}
            </Text>
          </Group>

          <Text size="sm" c="dimmed">
            Klik tanggal untuk lihat detail
          </Text>
        </Stack>

        <Stack>
          <SimpleGrid cols={7} p={"md"} bg={"dark.8"}>
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((w) => (
              <Text fw={700} key={w}>{w}</Text>
            ))}
          </SimpleGrid>

          <SimpleGrid cols={7}>
            {monthGrid.cells.map((cell, idx) => {
              if (!cell.date) {
                return <div key={idx} style={{ minHeight: 80 }} />;
              }
              const d = cell.date;
              const dayNum = d.date();
              const iso = d.format("YYYY-MM-DD");
              const today = d.isSame(dayjs(), "day");
              const holiday = isHoliday(iso);
              const hasImam = Boolean(
                monthly.data.imam && monthly.data.imam[String(dayNum)],
              );
              return (
                <UnstyledButton
                  bg={"dark"}
                  key={idx}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderRadius: 12,
                    minHeight: 80,
                    background: today ? "rgba(5, 51, 104, 0.39)" : undefined,
                    border: holiday ? "1px solid rgba(130, 61, 6, 1)" : undefined,
                    boxShadow: today
                      ? "0 6px 18px rgba(6,120,250,0.08)"
                      : undefined,
                  }}
                  onClick={() => {
                    setDate(d.toDate());
                  }}
                >
                  <Stack
                    gap={0}
                    h={"100%"}
                    justify="space-around"
                    align="stretch"
                  >
                    <Group justify="end">
                      {
                        <Badge
                          size="xs"
                          bg={hasImam ? "green.4" : "gray"}
                          variant="light"
                        />
                      }
                    </Group>
                    <Box>
                      <Text
                        size="2rem"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          background: holiday
                            ? "rgba(220,38,38,0.06)"
                            : "transparent",
                          color: holiday
                            ? "rgb(220,38,38)"
                            : today
                              ? "rgb(6,120,250)"
                              : undefined,
                        }}
                      >
                        {dayNum}
                      </Text>

                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {d.format("dddd")}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {holiday
                            ? holidays.find(
                              (h) => dayjs(h.date).format("YYYY-MM-DD") === iso,
                            )?.name
                            : ""}
                        </div>
                      </div>
                    </Box>
                  </Stack>

                  {/* small footer area */}
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  ></div>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
}

function RingkasanBulalan(
  monthly: any,
  year: number,
  month: number,
  isHoliday: (d: string) => boolean,
) {
  return (
    <Card padding="md" radius="md" mt="md" bg={"dark.9"}>
      <Stack gap="70">
        <Group justify="apart">
          <Group>
            <IconCalendar size={"2rem"} />
            <Text size="2rem" fw={700}>Ringkasan Bulanan</Text>
          </Group>
        </Group>

        <UserList />
        <SimpleGrid
          cols={{
            base: 2,
            md: 3,
          }}
        >
          {Object.keys(monthly.data.imam).map((d) => {
            const tglNum = Number(d);
            const iso = dayjs(
              `${year}-${String(month).padStart(2, "0")}-${String(tglNum).padStart(2, "0")}`,
            ).format("YYYY-MM-DD");
            const holiday = isHoliday(iso);
            const isToday = dayjs(iso).isSame(dayjs(), "day");
            return (
              <Paper
                radius="xl"
                key={d}
                p={"md"}
                c={holiday ? "red.9" : isToday ? "cyan" : "grey.9"}
                bg={"dark.9"}
                withBorder
              >
                <Stack>
                  <Group>
                    <Text size="2rem" fw={isToday ? 700 : 500}>
                      {dayjs(iso).format("ddd, DD")}
                    </Text>
                  </Group>

                  <Stack gap={0}>
                    <Group>
                      <IconUser size={16} />
                      <Text fw={700}>{monthly.data.imam[d]}</Text>
                    </Group>
                    <Group>
                      <IconClock size={16} />
                      <Text fw={700}>{monthly.data.ikomah[d]}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

function FullYearHoliday(year: number, holidays: HolidaysTypes.Holiday[]) {
  return (
    <Card padding="xl" radius="lg" shadow="md" bg={"dark.9"}>
      <Stack gap="md">
        <Group gap={6}>
          <IconGift size={"2rem"} />
          <Title size={"2rem"} order={4} fw={700}>
            Hari Libur Nasional Tahun {year}
          </Title>
        </Group>
        {holidays.length > 0 && (
          <Stack c={"teal.9"}>
            <SimpleGrid
              cols={{
                base: 2,
                md: 3,
              }}
            >
              {holidays.map((h, idx) => {
                const tgl = dayjs(h.date).format("DD MMMM YYYY");
                return (
                  <Flex key={idx} gap={"md"} align="center">
                    <IconCalendarStar size={16} />
                    <Text>{tgl}</Text>
                  </Flex>
                );
              })}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

const prayerGradients = {
  fajr: "linear-gradient(135deg, #6d7f8c, #778f8a, #7f998a)",
  sunrise: "linear-gradient(135deg, #8d7a63, #9a846c, #a28c74)",
  dhuhr: "linear-gradient(135deg, #647a69, #607463, #5c6a75)",
  asr: "linear-gradient(135deg, #767c5d, #7f845f, #888d62)",
  maghrib: "linear-gradient(135deg, #7c5f5f, #875f62, #8f6166)",
  isha: "linear-gradient(135deg, #595f7a, #505672, #484e6b)"
};

function JadwalHariIni(
  prayerList: {
    name: string;
    time: unknown;
    dt: dayjs.Dayjs;
    isPast: boolean;
    until: duration.Duration | null;
    Icon: any;
  }[],
  formatCountdown: (dt: dayjs.Dayjs) => string,
) {
  return (
    <Stack gap="sm">
      <Title order={4}>Jadwal Shalat Hari Ini</Title>
      <SimpleGrid
        cols={{
          base: 2,
          md: 4,
        }}
      >
        {prayerList.map((p) => {
          const Icon = p.Icon;
          return (
            <Card key={p.name} radius="lg" bg={prayerGradients[p.name as keyof typeof prayerGradients]}>
              <Stack
                gap="xs"
                align="stretch"
                justify="space-between"
                h={"100%"}
              >
                <Group justify="apart" align="center">
                  <Group>
                    <Icon size={22} />
                    <Text fw={700} style={{ textTransform: "capitalize" }}>
                      {p.name}
                    </Text>
                  </Group>
                </Group>

                <Group justify="apart" align="center">
                  <Text size="sm" c={p.isPast ? "dark" : undefined}>
                    {p.isPast ? "Sudah lewat" : formatCountdown(p.dt)}
                  </Text>

                  <Badge
                    color={p.isPast ? "orange" : "blue"}
                    variant="light"
                    radius="sm"
                  >
                    {p.isPast ? "Lewat" : "Akan datang"}
                  </Badge>
                </Group>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

function UserList() {
  const { data, error, isLoading } = useSwr(
    "/",
    apiFetch.api["jadwal-sholat"]["user-list"].get,
  );
  if (isLoading) return <Loader />;
  if (error) return <Text c="red">{error.message}</Text>;
  return (
    <SimpleGrid
      spacing={"sm"}
      cols={{
        base: 4,
        sm: 6,
      }}
    >
      {data?.data?.data?.map((u) => {
        if (u.active === false) return null;
        return (
          <Card key={u.id} radius={"40"} withBorder bg={"dark.9"}>
            <Flex align="center" gap={"md"}>
              <IconUser size={"2rem"} color="green" />
              <Text size="1rem">{u.name}</Text>
            </Flex>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
