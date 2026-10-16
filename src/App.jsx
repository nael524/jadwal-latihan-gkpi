import React, { useState, useEffect } from 'react';
import {
  Clock,
  Utensils,
  X,
  Sparkles,
  Filter,
  CalendarDays,
  Droplets,
  Bell,
  MapPin,
  Calendar,
  Volume2,
  Music
} from 'lucide-react';

const SCHEDULE_DATA = [
  // OKTOBER 2026
  {
    id: 1,
    day: 'MINGGU',
    date: '11, Oktober 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal,Songleader dan Mc',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Disediakan Air Mineral Clean Q oleh Panitia'
  },
  {
    id: 2,
    day: 'JUMAT',
    date: '16, Oktober 2026',
    time: '18.30 Malam',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Disediakan Air Mineral Clean Q oleh Panitia'
  },
  {
    id: 3,
    day: 'SENIN',
    date: '19, Oktober 2026',
    time: '19.00 Malam',
    location: 'Gereja GKPI Immanuel',
    activity: 'Pembagian Kegiatan Natal + Songleader',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q) + Roti',
    snackNote: 'Disediakan Air Mineral Clean Q oleh Panitia'
  },
  {
    id: 4,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral + Roti',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 5,
    day: 'MINGGU',
    date: '25, Oktober 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Drama +Prosesi + Songleader + Mc',
    hasSpecialSnack: false,
    snackTitle: 'Makan Roti & Minum Bandrek',
    snackNote: 'Spesial Minggu Ketiga: Makan Roti & Bandrek Panas + Clean Q'
  },
  {
    id: 6,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },

  // NOVEMBER 2026
  {
    id: 7,
    day: 'MINGGU',
    date: '01, November 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 8,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 9,
    day: 'MINGGU',
    date: '08, November 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Makan Roti & Minum Bandrek',
    snackNote: 'Spesial Hari Ini: Makan Roti & Bandrek Panas (Gratis) + Clean Q'
  },
  {
    id: 10,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 11,
    day: 'MINGGU',
    date: '15, November 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 12,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 13,
    day: 'MINGGU',
    date: '22, November 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Makan Roti & Minum Bandrek',
    snackNote: 'Disediakan Gratis: Roti + Bandrek Hangat + Clean Q'
  },
  {
    id: 14,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 15,
    day: 'MINGGU',
    date: '29, November 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },

  // DESEMBER 2026
  {
    id: 16,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 17,
    day: 'MINGGU',
    date: '06, Desember 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Gladi Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Makan Roti & Minum Bandrek',
    snackNote: 'Makan Roti & Minum Bandrek Hangat Gratis saat Gladi'
  },
  {
    id: 18,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 19,
    day: 'MINGGU',
    date: '13, Desember 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    activity: 'Gladi Resik Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Makan Roti & Minum Bandrek',
    snackNote: 'Makan Roti & Minum Bandrek Spesial Gladi Resik Akhir'
  },
  {
    id: 20,
    day: 'STAY TUNED',
    date: 'STAY TUNED',
    time: 'STAY TUNED',
    location: 'Gereja GKPI Immanuel',
    activity: 'Latihan Koor Natal',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 21,
    day: 'KAMIS (PRA JR)',
    date: '17, Desember 2026',
    time: '18.00 Malam',
    location: 'Gereja GKPI Immanuel',
    activity: 'Gladi Bersama Pra-Natal',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 22,
    day: 'JUMAT (JR)',
    date: '18, Desember 2026',
    time: '18.00 Malam',
    location: 'Gereja GKPI Immanuel',
    activity: 'Perayaan Natal Pemuda',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  }
];

// Helper konversi string tanggal ke Date Object
const parseScheduleDate = (dateStr) => {
  if (!dateStr || dateStr === 'STAY TUNED') return null;

  const monthMap = {
    'oktober': 9,
    'november': 10,
    'desember': 11
  };

  const parts = dateStr.replace(',', '').split(' ');
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1].toLowerCase();
  const year = parseInt(parts[2], 10);

  const month = monthMap[monthName];
  if (month === undefined || isNaN(day) || isNaN(year)) return null;

  return new Date(year, month, day, 0, 0, 0);
};

// Helper hitung selisih hari
const getDaysDifference = (targetDate) => {
  if (!targetDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const playCuteNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, type, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + duration);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(1046.50, 'sine', now, 0.12);
    playTone(1567.98, 'triangle', now + 0.1, 0.2);
  } catch (e) {
    console.log('Audio error:', e);
  }
};

// --- EFEK LOADING LOGO GKPI ELEGAN & RESPONSITF ---
const GKPILoader = ({ progress }) => (
  <div className="fixed inset-0 bg-[#041226] text-white z-50 flex flex-col items-center justify-center p-4 selection:bg-[#C2F215] selection:text-slate-950 font-sans">
    {/* Cahaya Latar Belakang */}
    <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

    <div className="relative flex flex-col items-center max-w-sm w-full text-center z-10 space-y-6">

      {/* Container Logo Bercahaya */}
      <div className="relative flex items-center justify-center">
        {/* Ring Putar Luar */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-transparent border-t-[#C2F215] border-r-blue-400 animate-spin"></div>

        {/* Glow Latar Logo */}
        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>

        {/* Siluet Logo GKPI / Salib Alkitab */}
        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-[#082247] to-[#0f3b7a] border border-cyan-400/40 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#C2F215] drop-shadow-[0_0_12px_rgba(194,242,21,0.6)]" viewBox="0 0 24 24" fill="currentColor">
            {/* Bentuk Salib Modern */}
            <rect x="10.5" y="3" width="3" height="18" rx="1.5" />
            <rect x="4" y="7.5" width="16" height="3" rx="1.5" />
            {/* Mahkota / Cahaya Atas */}
            <path d="M12 2L13.5 5H10.5L12 2Z" fill="#38BDF8" />
          </svg>
        </div>
      </div>

      {/* Teks Identitas */}
      <div className="space-y-1.5 px-2">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans drop-shadow-md">
          GKPI IMMANUEL
        </h2>
        <p className="text-[11px] sm:text-xs font-semibold text-cyan-300 tracking-widest uppercase">
          Resort Tanjung Mulia &bull; Medan
        </p>
      </div>



    </div>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [filterDay, setFilterDay] = useState('SEMUA');
  const [filterMonth, setFilterMonth] = useState('SEMUA');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Simulator Progress Loading
    const progressInterval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    const timer = setTimeout(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingSchedule = SCHEDULE_DATA.find((item) => {
        const scheduleDate = parseScheduleDate(item.date);
        return scheduleDate && scheduleDate >= now;
      });

      if (upcomingSchedule) {
        const parsedDate = parseScheduleDate(upcomingSchedule.date);
        const diff = getDaysDifference(parsedDate);
        setNextSchedule(upcomingSchedule);
        setDaysRemaining(diff);
        setShowNotice(true);
        setTimeout(() => {
          playCuteNotificationSound();
        }, 400);
      }

      setIsLoading(false);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
      document.head.removeChild(link);
    };
  }, []);

  const handleCloseScheduleNotice = () => {
    playCuteNotificationSound();
    setShowNotice(false);
  };

  const filteredSchedule = SCHEDULE_DATA.filter((item) => {
    const matchDay = filterDay === 'SEMUA' || item.day.includes(filterDay);
    const matchMonth = filterMonth === 'SEMUA' || item.date.includes(filterMonth);
    return matchDay && matchMonth;
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-sky-50/60 to-blue-100/40 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* TAMPILKAN EFEK LOADER LOGO GKPI JIKA MASIH LOADING */}
      {isLoading && <GKPILoader progress={loadProgress} />}

      <div>
        <header className="pt-10 pb-8 px-4 text-center max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Gereja GKPI Immanuel Resort Tanjung Mulia
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight uppercase font-sans drop-shadow-sm">
            Jadwal Latihan Natal
          </h1>
          <h2 className="text-base sm:text-xl font-bold text-blue-700 uppercase tracking-widest mt-1">
            Pemuda – Pemudi GKPI Immanuel
          </h2>

          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto font-medium">
            11 Oktober 2026 – 18 Desember 2026 &bull; Gereja GKPI Immanuel, Jl. Tanjung Mulia, Medan
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <div className="flex flex-wrap items-center justify-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-blue-200/90 shadow-md text-xs font-semibold">
              <span className="px-2 text-slate-500 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Hari:
              </span>
              {['SEMUA', 'MINGGU', 'SELASA', 'KAMIS', 'JUMAT'].map((day) => (
                <button
                  key={day}
                  onClick={() => setFilterDay(day)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 ${filterDay === day
                    ? 'bg-blue-800 text-white shadow-md font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-blue-200/90 shadow-md text-xs font-semibold">
              <span className="px-2 text-slate-500 font-medium">Bulan:</span>
              {['SEMUA', 'Oktober', 'November', 'Desember'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMonth(m)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 ${filterMonth === m
                    ? 'bg-[#C2F215] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                >
                  {m === 'SEMUA' ? 'Semua' : m.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pb-16 space-y-3.5">
          {filteredSchedule.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-blue-200/80 shadow-md font-medium">
              Tidak ada jadwal latihan sesuai filter ini.
            </div>
          ) : (
            filteredSchedule.map((item) => {
              const isSunday = item.day === 'MINGGU';

              return (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-r from-[#0a2752] via-[#0d346c] to-[#071f42] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-900/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>

                  <div className="flex items-center gap-3.5 min-w-0 flex-1 z-10">
                    <div className="bg-[#C2F215] text-slate-950 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex flex-col items-center justify-center min-w-[82px] text-center border border-lime-300 transform group-hover:scale-105 transition-transform duration-200 shrink-0">
                      <span>{item.day}</span>
                      <span className="text-[10px] opacity-80 font-semibold font-sans mt-0.5">
                        {isSunday ? '14.00' : '19.00'}
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1 pr-1">
                      <div className="text-[10px] text-cyan-300 uppercase font-bold tracking-widest flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-cyan-400 shrink-0" />
                        TANGGAL
                      </div>
                      <div className="font-bold text-sm sm:text-base text-white tracking-wide font-sans truncate">
                        {item.date}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#C2F215] font-semibold flex items-start gap-1.5 leading-tight pt-0.5 break-words">
                        <Music className="w-3.5 h-3.5 text-[#C2F215] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.activity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center space-y-0.5 px-3 shrink-0 z-10 border-x border-blue-700/40">
                    <div className="text-[10px] text-blue-300 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      JAM
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-cyan-100">
                      {item.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto ml-auto shrink-0 z-10">
                    <button
                      onClick={() => setSelectedSchedule(item)}
                      className="bg-white hover:bg-[#C2F215] text-[#082247] hover:text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-cyan-500/20 active:scale-95 flex items-center gap-2 shrink-0 border border-white/20"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>KONSUMSI</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      <footer className="bg-gradient-to-r from-[#061833] via-[#0b2b5c] to-[#061833] text-white text-center py-5 px-4 font-black text-xs sm:text-sm uppercase tracking-widest border-t-2 border-[#C2F215] shadow-2xl relative z-10">
        SELAMAT LATIHAN PEMUDA PEMUDI GKPI IMMANUEL
      </footer>

      {/* POPUP NOTIFIKASI JADWAL TERDEKAT DINAMIS */}
      {!isLoading && showNotice && nextSchedule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-slate-900 border border-blue-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden">

            <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#C2F215]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                  <Bell className="w-7 h-7 animate-bounce" />
                </div>
                <button
                  onClick={playCuteNotificationSound}
                  title="Putar Suara Notifikasi"
                  className="absolute -top-1 -right-1 bg-[#C2F215] text-slate-950 p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* STATUS HARI HITUNG MUNDUR */}
              <div className="inline-block bg-blue-900/60 border border-blue-400/30 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 uppercase tracking-widest mt-1">
                {daysRemaining === 0 && 'HARI INI BGT!'}
                {daysRemaining === 1 && '⏰ BESOK LATIHAN!'}
                {daysRemaining > 1 && `⏳ ${daysRemaining} HARI LAGI`}
              </div>

              <h3 className="font-extrabold text-lg text-white tracking-wide uppercase">
                PEMBERITAHUAN LATIHAN
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Hallo teman - teman Pemuda-Pemudi GKPI Immanuel!
              </p>
            </div>

            <div className="bg-slate-950/80 border border-blue-800/60 rounded-2xl p-4 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="bg-[#C2F215] text-slate-950 font-black text-xs px-3 py-1 rounded-xl shadow-md uppercase">
                  HARI {nextSchedule.day}
                </span>
                <span className="text-cyan-300 font-extrabold text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Jam {nextSchedule.time}
                </span>
              </div>

              <div className="space-y-2 pt-0.5">
                <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm font-bold">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Tanggal: {nextSchedule.date}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{nextSchedule.location}</span>
                </div>

                <div className="flex items-start gap-1.5 text-[#C2F215] font-bold bg-lime-400/10 px-2.5 py-1.5 rounded-xl border border-lime-400/20 text-xs leading-snug break-words">
                  <Sparkles className="w-4 h-4 text-[#C2F215] shrink-0 mt-0.5" />
                  <span>Kegiatan: {nextSchedule.activity}</span>
                </div>
              </div>
            </div>

            {/* PESAN NOTIFIKASI SESUAI STATUS HARI */}
            <p className="text-xs text-slate-300 font-medium leading-relaxed px-1">
              {daysRemaining === 0 && (
                <>Hari ini kita ada <strong className="text-[#C2F215]">{nextSchedule.activity}</strong> jam {nextSchedule.time}. Datang tepat waktu dan jangan telat ya! 🎵</>
              )}
              {daysRemaining === 1 && (
                <>Jangan lupa besok hari {nextSchedule.day.toLowerCase()} kita ada <strong className="text-[#C2F215]">{nextSchedule.activity}</strong>. Persiapkan diri kamu! 🎼</>
              )}
              {daysRemaining > 1 && (
                <>Ingat ya, {daysRemaining} hari lagi pada hari {nextSchedule.day.toLowerCase()} ({nextSchedule.date}) kita ada <strong className="text-[#C2F215]">{nextSchedule.activity}</strong>. Jangan sampai terlewat! </>
              )}
            </p>

            <button
              onClick={handleCloseScheduleNotice}
              className="w-full bg-[#C2F215] hover:bg-lime-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl uppercase tracking-widest transition-all shadow-lg shadow-lime-400/20 active:scale-95"
            >
              {daysRemaining === 0 ? 'SIAP LATIHAN HARI INI!' : 'OKE, SIAP LATIHAN!'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL KONSUMSI */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-200">
          <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-blue-500/30 max-h-[90vh] flex flex-col text-slate-100">

            <div className="bg-gradient-to-r from-[#082247] via-[#0c2f60] to-[#082247] p-4 text-white flex items-center justify-between border-b border-blue-700/40">
              <div className="flex items-center gap-3">
                <span className="bg-[#C2F215] text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md">
                  {selectedSchedule.day}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white">
                    {selectedSchedule.date}
                  </h3>
                  <p className="text-[11px] text-cyan-300 font-medium mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {selectedSchedule.time} &bull; {selectedSchedule.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSchedule(null)}
                className="p-2 rounded-full bg-[#0a2752]/60 hover:bg-[#0a2752] text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200 flex-1">
              {selectedSchedule.hasSpecialSnack ? (
                <div className="bg-gradient-to-b from-amber-500/20 via-amber-950/30 to-slate-900 border-2 border-amber-400/50 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden shadow-xl">
                  <div className="inline-flex items-center justify-center p-3.5 bg-amber-400/20 rounded-full text-amber-300 mb-0.5">
                    <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-amber-300 text-base sm:text-lg tracking-wide">
                    KONSUMSI SPESIAL HARI INI!
                  </h4>
                  <p className="text-xs text-amber-100 font-medium">
                    Panitia Natal menyediakan konsumsi istimewa secara gratis untuk seluruh pemuda-pemudi:
                  </p>

                  <div className="bg-slate-950/90 border border-amber-400/40 rounded-2xl p-4 font-black text-amber-300 text-sm sm:text-base shadow-inner flex flex-col items-center justify-center gap-2">
                    <span> MAKAN ROTI & MINUM BANDREK</span>
                    <span className="text-xs text-[#C2F215] font-semibold flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-cyan-400" /> + Clean Q Air Mineral
                    </span>
                  </div>

                  <span className="inline-block text-xs font-extrabold text-slate-950 bg-emerald-400 px-4 py-1.5 rounded-full uppercase shadow-md">
                    ✓ Gratis Disediakan Panitia Natal
                  </span>
                </div>
              ) : (
                <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-6 text-center space-y-4 shadow-inner">
                  <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-400/40 rounded-full flex items-center justify-center mx-auto text-cyan-300">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-cyan-300 text-base sm:text-lg">
                      💧 KONSUMSI AIR MINERAL (Clean Q)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 font-medium leading-relaxed">
                      {selectedSchedule.snackNote}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-blue-900/60 rounded-xl p-3.5 text-cyan-200 text-xs font-semibold">
                    Gelas / Botol Clean Q Segar Tersedia di Ruang Latihan
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center italic pt-2">
                *Harap selalu membuang botol/gelas Clean Q ke tempat sampah Gereja GKPI Immanuel.
              </p>
            </div>

            <div className="bg-slate-950 p-4 border-t border-blue-900/60 flex items-center justify-between">
              <span className="text-[11px] text-blue-300/70 font-medium px-2">
                Panitia Natal GKPI Immanuel
              </span>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="bg-[#C2F215] hover:bg-lime-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}