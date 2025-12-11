import clientRoutes from "./clientRoutes";

export function LandingPage() {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jadwal Sholat & Imam — Semua dalam Satu Genggaman</title>

        <style>{`
          :root{
            --bg-1: #0f172a;
            --accent: #4F46E5;
            --accent-2: #7c3aed;
            --glass: rgba(255,255,255,0.06);
            --muted: rgba(255,255,255,0.85);
            --card: rgba(255,255,255,0.04);
            --glass-strong: rgba(255,255,255,0.08);
            --radius-lg: 16px;
            --radius-sm: 8px;
            --max-w: 1200px;
            --glass-border: rgba(255,255,255,0.06);
            --shadow: 0 10px 30px rgba(2,6,23,0.6);
            color-scheme: dark;
          }

          *{box-sizing:border-box;margin:0;padding:0}
          html,body,#root{height:100%}
          body{
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            background:
              radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.12), transparent 8%),
              radial-gradient(1000px 400px at 90% 90%, rgba(79,70,229,0.10), transparent 8%),
              linear-gradient(180deg, #071024 0%, #071229 40%, #08162f 100%);
            color: var(--muted);
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
            overflow-x:hidden;
            padding-bottom:80px;
          }

          .container{
            max-width:var(--max-w);
            margin:0 auto;
            padding:0 20px;
            width:100%;
          }

          /* NAVBAR */
          nav{
            position:sticky;
            top:0;
            z-index:60;
            backdrop-filter: blur(8px);
            background: linear-gradient(180deg, rgba(7,10,20,0.6), rgba(7,10,20,0.35));
            border-bottom: 1px solid var(--glass-border);
            padding:14px 0;
          }
          .nav-row{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
          }
          .brand{
            display:flex;
            align-items:center;
            gap:12px;
          }
          .logo{
            width:44px;
            height:44px;
            border-radius:10px;
            background: linear-gradient(135deg,var(--accent),var(--accent-2));
            display:grid;
            place-items:center;
            font-weight:700;
            color:white;
            box-shadow: var(--shadow);
            font-family: Inter, sans-serif;
          }
          .brand-title{
            font-weight:700;
            font-size:16px;
            letter-spacing:0.2px;
            color:white;
          }

          .nav-links{
            display:flex;
            gap:18px;
            align-items:center;
          }
          .nav-links a{
            color:var(--muted);
            text-decoration:none;
            font-weight:600;
            font-size:14px;
            padding:8px 10px;
            border-radius:8px;
          }
          .nav-links a:hover{background:var(--glass-strong)}
          .cta{
            padding:10px 18px;
            background: linear-gradient(90deg,var(--accent),var(--accent-2));
            color:white;
            border-radius:12px;
            font-weight:700;
            text-decoration:none;
            box-shadow: 0 8px 30px rgba(79,70,229,0.18);
            display:inline-flex;
            gap:10px;
            align-items:center;
          }

          /* HERO */
          .hero{
            padding:100px 0 60px;
            display:grid;
            grid-template-columns: 1fr 420px;
            gap:36px;
            align-items:center;
          }
          .hero-left h1{
            font-size:40px;
            line-height:1.05;
            margin-bottom:12px;
            color: #fff;
            font-weight:800;
          }
          .kicker{
            display:inline-block;
            padding:6px 12px;
            border-radius:999px;
            background:rgba(255,255,255,0.04);
            color: #e6e9ff;
            font-weight:700;
            margin-bottom:18px;
            font-size:13px;
          }
          .hero-lead{
            font-size:18px;
            opacity:0.95;
            margin-bottom:22px;
            max-width:680px;
          }
          .hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
          .btn-primary{
            background: linear-gradient(90deg,var(--accent),var(--accent-2));
            color:white;
            padding:12px 20px;
            border-radius:12px;
            font-weight:700;
            text-decoration:none;
            display:inline-flex;
            gap:10px;
            align-items:center;
            box-shadow: 0 10px 30px rgba(79,70,229,0.14);
          }
          .btn-ghost{
            background:transparent;
            border:1px solid var(--glass-border);
            color:var(--muted);
            padding:10px 18px;
            border-radius:12px;
            font-weight:700;
            text-decoration:none;
          }
          .micro-note{
            margin-top:12px;
            font-size:13px;
            opacity:0.8;
          }

          /* HERO RIGHT: preview card (calendar + next prayer) */
          .preview-card{
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            border: 1px solid var(--glass-border);
            padding:18px;
            border-radius:var(--radius-lg);
            box-shadow: var(--shadow);
          }
          .preview-head{
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:8px;
            margin-bottom:12px;
          }
          .location{
            font-weight:700;
            color:white;
          }
          .next-prayer{
            display:flex;
            gap:12px;
            align-items:center;
          }
          .next-prayer .time{
            font-weight:800;
            font-size:22px;
            color:white;
          }
          .countdown{
            font-size:13px;
            opacity:0.9;
          }

          .mini-calendar{
            margin-top:12px;
            display:grid;
            grid-template-columns: repeat(7, 1fr);
            gap:6px;
          }
          .mini-calendar .day{
            padding:8px 6px;
            text-align:center;
            border-radius:8px;
            font-size:13px;
            background:transparent;
            color:var(--muted);
            border:1px solid transparent;
          }
          .mini-calendar .holiday{
            background: rgba(220,38,38,0.15);
            color: #ffd7d7;
            border:1px solid rgba(220,38,38,0.2);
          }
          .mini-calendar .today{
            background: linear-gradient(90deg,#0ea5a4, #06b6d4);
            color:white;
            font-weight:700;
          }

          /* FEATURES */
          .section{
            padding:72px 0;
          }
          .section h2{
            font-size:28px;
            color:#fff;
            margin-bottom:18px;
            font-weight:800;
          }
          .lead{
            color:var(--muted);
            margin-bottom:28px;
            font-size:15px;
            max-width:760px;
          }
          .features-grid{
            display:grid;
            grid-template-columns: repeat(3, 1fr);
            gap:20px;
          }
          .card{
            background:var(--card);
            border-radius:12px;
            padding:20px;
            border:1px solid var(--glass-border);
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }
          .card:hover{ transform: translateY(-8px); box-shadow: 0 20px 40px rgba(2,6,23,0.6) }
          .card h3{ font-size:16px; margin-bottom:10px; color:white; font-weight:800 }
          .card p{ font-size:14px; opacity:0.9; line-height:1.5 }

          /* STATS / BADGES */
          .badges{
            display:flex;
            gap:12px;
            margin-top:18px;
            flex-wrap:wrap;
          }
          .badge{
            padding:10px 14px;
            border-radius:999px;
            background: rgba(255,255,255,0.03);
            font-weight:700;
            font-size:13px;
          }

          /* CTA BAR */
          .cta-bar{
            margin-top:30px;
            display:flex;
            gap:12px;
            align-items:center;
            justify-content:center;
            flex-wrap:wrap;
            padding:18px;
            border-radius:12px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
            border:1px solid var(--glass-border);
          }

          /* FOOTER */
          footer{
            margin-top:40px;
            padding:40px 0 80px;
            color:var(--muted);
            text-align:center;
            border-top:1px solid var(--glass-border);
            background: linear-gradient(180deg, transparent, rgba(0,0,0,0.25));
          }
          footer .frow{
            display:flex;
            justify-content:space-between;
            gap:20px;
            align-items:center;
            max-width:var(--max-w);
            margin:0 auto;
            padding:0 20px;
          }
          .contact{
            text-align:right;
          }
          .contact a{ color:var(--muted); text-decoration:none; font-weight:700 }
          .copyright{ margin-top:18px; font-size:13px; opacity:0.8 }

          /* RESPONSIVE */
          @media (max-width:1000px){
            .hero{ grid-template-columns: 1fr 360px }
            .features-grid{ grid-template-columns: repeat(2, 1fr) }
          }
          @media (max-width:768px){
            .nav-links{ display:none }
            .hero{ grid-template-columns: 1fr; padding:64px 0 32px; gap:18px }
            .preview-card{ order: -1 }
            .features-grid{ grid-template-columns: 1fr }
            .frow{ flex-direction:column; text-align:center }
            .contact{ text-align:center }
          }

          /* small helpers */
          .muted { opacity:0.86; font-size:14px }
          a.reset { color:inherit; text-decoration:none; }
        `}</style>
      </head>

      <body>
        <nav>
          <div className="container">
            <div className="nav-row">
              <div className="brand">
                <div className="logo" aria-hidden>
                  𝕵
                </div>
                <div>
                  <div className="brand-title">Jadwal Sholat & Imam</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Semua jadwal, imam, & libur — satu genggaman
                  </div>
                </div>
              </div>

              <div className="nav-links" role="navigation" aria-label="Main">
                <a href="#features">Fitur</a>
                <a href="#calendar">Kalender</a>
                <a href="#imams">Jadwal Imam</a>
                <a href="#docs">Dokumentasi</a>
                <a href={clientRoutes["/dashboard"]} className="cta">
                  Masjid Saya
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <section className="hero">
            <div className="container hero-left">
              <div className="kicker">PWA · Open Source · API</div>
              <h1>
                Semua jadwal shalat, imam, dan hari libur — dalam satu
                genggaman.
              </h1>
              <p className="hero-lead">
                Waktu adhan otomatis berdasarkan koordinat Anda. Countdown
                real-time menuju iqomah, kalender interaktif, dan daftar libur
                nasional yang ter-update setiap tahun — ringan, cepat, dan bisa
                dipasang di layar masjid.
              </p>

              <div className="hero-ctas">
                <a href={clientRoutes["/shalat"]} className="btn-primary">
                  Lihat Demo
                </a>
                <a href="#docs" className="btn-ghost">
                  Dokumentasi API
                </a>
                <a href={clientRoutes["/dashboard"]} className="btn-ghost">
                  Pasang di Masjid Saya
                </a>
              </div>

              <div className="micro-note">
                <strong>Tips:</strong> Izinkan akses lokasi untuk akurasi adhan.
                Bisa di-install sebagai PWA untuk akses 1-tap.
              </div>

              <div style={{ marginTop: 28 }}>
                <div className="badges" aria-hidden>
                  <div className="badge">Next.js + SWR</div>
                  <div className="badge">Skeleton & Offline</div>
                  <div className="badge">Auto-load Hari Libur ID</div>
                  <div className="badge">REST API & Webhooks</div>
                </div>
              </div>
            </div>

            <aside
              className="container preview-card"
              aria-label="Preview jadwal"
            >
              <div className="preview-head">
                <div>
                  <div className="location">Masjid Al-Hikmah • Makassar</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Koordinat: 5.1477° S, 119.4327° E
                  </div>
                </div>

                <div className="next-prayer" aria-live="polite">
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                      Sholat berikutnya
                    </div>
                    <div className="time">Maghrib — 18:03</div>
                    <div className="countdown">
                      Iqomah dalam <strong>15m 12s</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    fontSize: 13,
                    marginBottom: 8,
                    color: "var(--muted)",
                  }}
                >
                  Waktu adhan hari ini
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 8,
                  }}
                >
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>Subuh</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>04:31</div>
                  </div>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>Dzuhur</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>12:03</div>
                  </div>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>Ashr</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>15:24</div>
                  </div>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>Isya</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>19:10</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    fontSize: 13,
                    marginBottom: 8,
                    color: "var(--muted)",
                  }}
                >
                  Mini kalender — klik tanggal untuk lihat imam
                </div>
                <div
                  className="mini-calendar"
                  role="grid"
                  aria-label="Mini kalender"
                >
                  {/* Static example days — highlight classes indicate holiday/today */}
                  <div className="day muted">Min</div>
                  <div className="day muted">Sen</div>
                  <div className="day muted">Sel</div>
                  <div className="day muted">Rab</div>
                  <div className="day muted">Kam</div>
                  <div className="day muted">Jum</div>
                  <div className="day muted">Sab</div>

                  <div className="day">1</div>
                  <div className="day">2</div>
                  <div className="day holiday">3</div>
                  <div className="day">4</div>
                  <div className="day">5</div>
                  <div className="day">6</div>
                  <div className="day today">7</div>

                  {/* more days... */}
                </div>
              </div>
            </aside>
          </section>

          <section id="features" className="section container">
            <h2>Mengapa pilih Jadwal Sholat & Imam?</h2>
            <p className="lead">
              Satu tampilan untuk semua informasi: adhan otomatis sesuai
              koordinat, countdown iqomah real-time, kalender interaktif, dan
              daftar libur nasional yang diambil otomatis tiap tahun.
            </p>

            <div className="features-grid" style={{ marginTop: 12 }}>
              <div className="card" role="article" aria-labelledby="f1">
                <h3 id="f1">Satu tampilan, semua informasi</h3>
                <p>
                  Waktu adhan (fajr, dhuhr, asr, maghrib, isha) otomatis
                  menyesuaikan lokasi Anda. Icon dinamis membantu membaca
                  kondisi (matahari, senja, bulan).
                </p>
              </div>

              <div className="card" role="article" aria-labelledby="f2">
                <h3 id="f2">Kalender interaktif</h3>
                <p>
                  Klik tanggal untuk melihat jadwal imam dan waktu adhan di hari
                  tersebut. Hari libur nasional berwarna merah; hari ini
                  di-highlight biru. Navigasi bulan & tahun cepat seperti swipe.
                </p>
              </div>

              <div className="card" role="article" aria-labelledby="f3">
                <h3 id="f3">Jadwal imam bulanan</h3>
                <p>
                  Tabel ringkasan 30 hari menampilkan siapa imam & menit iqomah
                  setiap hari — cocok untuk pengingat, laporan, atau tampilan
                  papan pengumuman di masjid.
                </p>
              </div>

              <div className="card" role="article" aria-labelledby="f4">
                <h3 id="f4">Daftar libur nasional otomatis</h3>
                <p>
                  Auto-load libur Indonesia tiap tahun lengkap dengan tipe
                  (libur nasional / cuti bersama) dan keterangan tambahan untuk
                  perencanaan kegiatan masjid.
                </p>
              </div>

              <div className="card" role="article" aria-labelledby="f5">
                <h3 id="f5">Ringan & cepat</h3>
                <p>
                  Menggunakan strategi cache dan incremental fetch (SWR /
                  stale-while-revalidate) — hanya data berubah diambil ulang.
                  Skeleton screen & PWA untuk pengalaman stabil di jaringan
                  lambat.
                </p>
              </div>

              <div className="card" role="article" aria-labelledby="f6">
                <h3 id="f6">Open source & mudah dikustom</h3>
                <p>
                  Kode tersedia di GitHub. Ganti koordinat, tema, atau aktifkan
                  push-notification dengan cepat. REST API internal siap dipakai
                  untuk mobile atau display LED.
                </p>
              </div>
            </div>

            <div className="cta-bar" style={{ marginTop: 26 }}>
              <a href={clientRoutes["/shalat"]} className="btn-primary">
                Coba Demo Sekarang
              </a>
              <a href="#docs" className="btn-ghost">
                Buka Dokumentasi API
              </a>
              <a href={clientRoutes["/dashboard"]} className="btn-ghost">
                Pasang di Masjid Saya
              </a>
            </div>
          </section>

          <section
            id="imams"
            className="section container"
            style={{ paddingTop: 20 }}
          >
            <h2>Contoh — Jadwal Imam Bulanan</h2>
            <p className="lead">
              Ringkasan 30 hari: lihat siapa imam setiap hari, menit iqomah, dan
              catatan (cuti / acara khusus).
            </p>

            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 720,
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid var(--glass-border)",
                    }}
                  >
                    <th style={{ padding: 12 }}>Tanggal</th>
                    <th style={{ padding: 12 }}>Imam</th>
                    <th style={{ padding: 12 }}>Iqomah (menit)</th>
                    <th style={{ padding: 12 }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td style={{ padding: 12 }}>2025-12-07</td>
                    <td style={{ padding: 12 }}>Ust. Ahmad</td>
                    <td style={{ padding: 12 }}>10</td>
                    <td style={{ padding: 12 }}>—</td>
                  </tr>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td style={{ padding: 12 }}>2025-12-08</td>
                    <td style={{ padding: 12 }}>Ust. Budi</td>
                    <td style={{ padding: 12 }}>8</td>
                    <td style={{ padding: 12 }}>Libur Nasional</td>
                  </tr>
                  {/* more rows — replace with dynamic data in real app */}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="docs"
            className="section container"
            style={{ paddingTop: 8 }}
          >
            <h2>Cepat Mulai</h2>
            <p className="lead">
              1) Kunjungi{" "}
              <a href="https://jadwalsholat.example.com" className="reset">
                jadwalsholat.example.com
              </a>
              <br />
              2) Izinkan akses lokasi → waktu adhan otomatis.
              <br />
              3) Klik tanggal di kalender untuk melihat jadwal imam.
              <br />
              4) Tambahkan ke layar utama sebagai PWA untuk akses 1-tap.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <a href={clientRoutes["/shalat"]} className="btn-primary">
                Lihat Demo
              </a>
              <a href="#docs" className="btn-ghost">
                Dokumentasi API
              </a>
              <a href={clientRoutes["/dashboard"]} className="btn-ghost">
                Pasang di Masjid Saya
              </a>
            </div>
          </section>
        </main>

        <footer>
          <div className="frow">
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                Jadwal Sholat & Imam
              </div>
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                Perangkat lunak open-source untuk manajemen jadwal masjid.
              </div>
            </div>

            <div className="contact">
              <div style={{ fontWeight: 700 }}>Hubungi kami</div>
              <div style={{ marginTop: 6 }}>
                <a href="mailto:hi@jadwalsholat.example.com">
                  hi@jadwalsholat.example.com
                </a>
              </div>
              <div style={{ marginTop: 6 }}>
                <a href="tel:+6281234567890">+62 812 3456 7890</a>
              </div>
            </div>
          </div>

          <div className="container copyright">
            <div>PERCOBAAN GRATIS · TANPA IKLAN · DATA AMAN</div>
            <div style={{ marginTop: 8 }}>
              © {new Date().getFullYear()} Jadwal Sholat & Imam. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
