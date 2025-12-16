import clientRoutes from "../clientRoutes";

export default function Home() {
  return (
    <html lang="id" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jadwal Sholat & Imam — Semua dalam Satu Genggaman</title>
      </head>

      <body className="
        min-h-screen text-slate-200 
        bg-gradient-to-b from-[#071024] via-[#071229] to-[#08162f]
        bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(124,58,237,0.12),transparent_8%)]
        bg-[radial-gradient(1000px_400px_at_90%_90%,rgba(79,70,229,0.10),transparent_8%)]
        overflow-x-hidden pb-20
      ">
        {/* NAVBAR */}
        <nav className="
          sticky top-0 z-50
          backdrop-blur-md
          bg-[linear-gradient(180deg,rgba(7,10,20,0.6),rgba(7,10,20,0.35))]
          border-b border-white/10 py-3
        ">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="
                  w-11 h-11 rounded-xl 
                  bg-gradient-to-br from-indigo-600 to-violet-600 
                  grid place-items-center font-bold text-white shadow-xl
                ">
                  𝕵
                </div>
                <div>
                  <div className="text-white font-bold text-[16px]">
                    Jadwal Sholat & Imam
                  </div>
                  <div className="text-[12px] opacity-75">
                    Semua jadwal, imam, & libur — satu genggaman
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4 text-[14px] font-semibold">
                <a href="#features" className="px-2 py-1 rounded-lg hover:bg-white/10 text-white">Fitur</a>
                <a href="#calendar" className="px-2 py-1 rounded-lg hover:bg-white/10 text-white">Kalender</a>
                <a href="#imams" className="px-2 py-1 rounded-lg hover:bg-white/10 text-white">Jadwal Imam</a>
                <a href="#docs" className="px-2 py-1 rounded-lg hover:bg-white/10 text-white">Dokumentasi</a>
                <a
                  href={clientRoutes["/dashboard"]}
                  className="text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold shadow-lg"
                >
                  Masjid Saya
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main>
          {/* HERO */}
          <section className="grid md:grid-cols-[1fr_420px] gap-8 max-w-[1200px] mx-auto px-5 py-24">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-indigo-100 font-bold text-[13px] mb-4">
                PWA · Open Source · API
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                Semua jadwal shalat, imam, dan hari libur — dalam satu genggaman.
              </h1>

              <p className="text-[18px] opacity-95 mb-6 max-w-xl">
                Waktu adhan otomatis berdasarkan koordinat Anda. Countdown real-time menuju iqomah,
                kalender interaktif, dan daftar libur nasional yang ter-update setiap tahun —
                ringan, cepat, dan bisa dipasang di layar masjid.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={clientRoutes["/shalat"]}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold shadow-xl"
                >
                  Lihat Demo
                </a>

                <a
                  href="#docs"
                  className="px-4 py-3 rounded-xl border border-white/15 font-bold text-slate-200"
                >
                  Dokumentasi API
                </a>

                <a
                  href={clientRoutes["/dashboard"]}
                  className="px-4 py-3 rounded-xl border border-white/15 font-bold text-slate-200"
                >
                  Pasang di Masjid Saya
                </a>
              </div>

              <div className="text-[13px] mt-3 opacity-80">
                <strong>Tips:</strong> Izinkan akses lokasi untuk akurasi adhan. Bisa di-install
                sebagai PWA untuk akses 1-tap.
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-3 mt-7">
                {["Next.js + SWR", "Skeleton & Offline", "Auto-load Hari Libur ID", "REST API & Webhooks"]
                  .map((b) => (
                    <div
                      key={b}
                      className="px-4 py-2 rounded-full bg-white/5 text-[13px] font-bold"
                    >
                      {b}
                    </div>
                  ))}
              </div>
            </div>

            {/* PREVIEW CARD */}
            <aside className="
              p-5 rounded-2xl border border-white/10 shadow-xl 
              bg-gradient-to-b from-white/5 to-white/0
            ">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-bold text-white">
                    Masjid Al-Hikmah • Makassar
                  </div>
                  <div className="text-[13px] opacity-80">
                    Koordinat: 5.1477° S, 119.4327° E
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[12px] opacity-80">Sholat berikutnya</div>
                  <div className="text-[22px] font-extrabold text-white">Maghrib — 18:03</div>
                  <div className="text-[13px] opacity-90">
                    Iqomah dalam <strong>15m 12s</strong>
                  </div>
                </div>
              </div>

              {/* WAKTU ADHAN */}
              <div className="mt-2">
                <div className="text-[13px] mb-2 opacity-80">Waktu adhan hari ini</div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Subuh", "04:31"],
                    ["Dzuhur", "12:03"],
                    ["Ashr", "15:24"],
                    ["Isya", "19:10"],
                  ].map(([name, t]) => (
                    <div
                      key={name}
                      className="rounded-xl p-3 border border-white/10 bg-white/5"
                    >
                      <div className="text-[13px] opacity-90">{name}</div>
                      <div className="font-extrabold text-[16px] text-white">{t}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MINI CALENDAR */}
              <div className="mt-4">
                <div className="text-[13px] mb-2 opacity-80">
                  Mini kalender — klik tanggal untuk lihat imam
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
                  {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                    <div key={d} className="opacity-70">{d}</div>
                  ))}

                  <div className="py-2 rounded-lg">1</div>
                  <div className="py-2 rounded-lg">2</div>
                  <div className="py-2 rounded-lg bg-red-900/30 border border-red-500/20 text-red-200">
                    3
                  </div>
                  <div className="py-2 rounded-lg">4</div>
                  <div className="py-2 rounded-lg">5</div>
                  <div className="py-2 rounded-lg">6</div>
                  <div className="py-2 rounded-lg bg-cyan-600 text-white font-bold">
                    7
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* FEATURES */}
          <section id="features" className="max-w-[1200px] mx-auto px-5 py-20">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Mengapa pilih Jadwal Sholat & Imam?
            </h2>
            <p className="text-[15px] opacity-85 mb-6 max-w-2xl">
              Satu tampilan untuk semua informasi: adhan otomatis sesuai koordinat,
              countdown iqomah real-time, kalender interaktif, dan daftar libur nasional
              yang diambil otomatis tiap tahun.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                [
                  "Satu tampilan, semua informasi",
                  "Waktu adhan otomatis menyesuaikan lokasi Anda."
                ],
                [
                  "Kalender interaktif",
                  "Klik tanggal untuk melihat jadwal imam & waktu adhan."
                ],
                [
                  "Jadwal imam bulanan",
                  "Tabel ringkasan 30 hari dengan imam & iqomah."
                ],
              ].map(([title, desc], i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:-translate-y-2 hover:shadow-2xl transition"
                >
                  <h3 className="text-white font-extrabold text-[16px] mb-2">
                    {title}
                  </h3>
                  <p className="text-[14px] opacity-90">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="
          mt-10 py-10 
          border-t border-white/10 
          text-center text-slate-400
          bg-gradient-to-b from-transparent to-black/25
        ">
          <div className="max-w-[1200px] mx-auto px-5">
            <p className="text-[13px] opacity-80">
              © {new Date().getFullYear()} Jadwal Sholat & Imam — All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
