import React, { useState, useEffect, useRef } from 'react';
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
  BellRing,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const SCHEDULE_DATA = [
  // OKTOBER 2026
  {
    id: 1,
    day: 'MINGGU',
    date: '11, Oktober 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Disediakan Air Mineral Clean Q oleh Panitia'
  },
  {
    id: 2,
    day: 'SELASA',
    date: '13, Oktober 2026',
    time: '19.00 Malam',
    location: 'Gereja GKPI Immanuel',
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Disediakan Air Mineral Clean Q oleh Panitia'
  },
  {
    id: 3,
    day: 'MINGGU',
    date: '18, Oktober 2026',
    time: '14.00 Siang',
    location: 'Gereja GKPI Immanuel',
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
    hasSpecialSnack: false,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 21,
    day: 'KAMIS (PRA JR)',
    date: '17 Desember 2026',
    time: '18.00 Malam',
    location: 'Gereja GKPI Immanuel',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  },
  {
    id: 22,
    day: 'JUMAT (JR)',
    date: '18 Desember 2026',
    time: '18.00 Malam',
    location: 'Gereja GKPI Immanuel',
    hasSpecialSnack: true,
    snackTitle: 'Air Mineral (Clean Q)',
    snackNote: 'Air Mineral Clean Q Disediakan Panitia'
  }
];

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

export default function App() {
  const [filterDay, setFilterDay] = useState('SEMUA');
  const [filterMonth, setFilterMonth] = useState('SEMUA');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  const timerRef = useRef(null);

  // Registrasi Service Worker di HP
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwRegistration(reg);
        })
        .catch((err) => {
          console.error('Service Worker Registration Failed:', err);
        });
    }
  }, []);

  // Memunculkan Notifikasi di Status Bar HP lewat Service Worker
  const triggerDeviceNotification = async (schedule) => {
    if (!schedule) return;

    const title = 'Pengingat Latihan Natal GKPI! 🔔';
    const options = {
      body: `Hallo! Jangan lupa ya hari ${schedule.day.toLowerCase()} ini ada latihan tanggal ${schedule.date} jam ${schedule.time}. Jangan telat!`,
      icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'gkpi-practice-reminder',
      renotify: true,
      requireInteraction: true
    };

    // Panggil Service Worker untuk menampilkan notifikasi di HP
    if (swRegistration && swRegistration.showNotification) {
      await swRegistration.showNotification(title, options);
    } else if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
      }
    }
  };

  const startThreeHourTimer = (schedule) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    timerRef.current = setInterval(() => {
      triggerDeviceNotification(schedule);
    }, THREE_HOURS);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const activeSchedule = SCHEDULE_DATA.find((item) => item.date !== 'STAY TUNED');

    if (activeSchedule) {
      setNextSchedule(activeSchedule);
      setShowNotice(true);
      setTimeout(() => {
        playCuteNotificationSound();
      }, 300);

      if (localStorage.getItem('device_notification_granted') === 'true') {
        startThreeHourTimer(activeSchedule);
      }
    }

    return () => {
      document.head.removeChild(link);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [swRegistration]);

  const handleCloseScheduleNotice = () => {
    playCuteNotificationSound();
    setShowNotice(false);

    const hasPrompted = localStorage.getItem('device_notification_asked');
    if (!hasPrompted) {
      setTimeout(() => {
        setShowPermissionPrompt(true);
      }, 300);
    }
  };

  const handleAllowNotifications = async () => {
    localStorage.setItem('device_notification_asked', 'true');
    setShowPermissionPrompt(false);
    playCuteNotificationSound();

    if (!('Notification' in window)) {
      alert('Browser di HP ini belum mendukung fitur Notifikasi System.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        localStorage.setItem('device_notification_granted', 'true');

        if (nextSchedule) {
          // Kirim notifikasi pertama langsung ke status bar HP
          await triggerDeviceNotification(nextSchedule);
          startThreeHourTimer(nextSchedule);
        }
      } else {
        localStorage.setItem('device_notification_granted', 'false');
        alert('Izin notifikasi ditolak di HP kamu.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDenyNotifications = () => {
    localStorage.setItem('device_notification_asked', 'true');
    localStorage.setItem('device_notification_granted', 'false');
    setShowPermissionPrompt(false);
  };

  const filteredSchedule = SCHEDULE_DATA.filter((item) => {
    const matchDay = filterDay === 'SEMUA' || item.day === filterDay;
    const matchMonth = filterMonth === 'SEMUA' || item.date.includes(filterMonth);
    return matchDay && matchMonth;
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-sky-50/60 to-blue-100/40 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
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
            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-blue-200/90 shadow-md text-xs font-semibold">
              <span className="px-2 text-slate-500 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Hari:
              </span>
              {['SEMUA', 'MINGGU', 'SELASA'].map((day) => (
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
                  className="group relative bg-gradient-to-r from-[#0a2752] via-[#0d346c] to-[#071f42] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-900/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>

                  <div className="flex items-center gap-3.5 shrink-0 z-10">
                    <div className="bg-[#C2F215] text-slate-950 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex flex-col items-center justify-center min-w-[82px] text-center border border-lime-300 transform group-hover:scale-105 transition-transform duration-200">
                      <span>{item.day}</span>
                      <span className="text-[10px] opacity-80 font-semibold font-sans mt-0.5">
                        {isSunday ? '14.00' : '19.00'}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] text-cyan-300 uppercase font-bold tracking-widest flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-cyan-400" />
                        TANGGAL
                      </div>
                      <div className="font-bold text-sm sm:text-base text-white tracking-wide font-sans">
                        {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center space-y-0.5 px-3 z-10 border-x border-blue-700/40">
                    <div className="text-[10px] text-blue-300 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      JAM
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-cyan-100">
                      {item.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto ml-auto z-10">
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

      {/* POPUP NOTIFIKASI JADWAL TERDEKAT */}
      {showNotice && nextSchedule && (
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

              <h3 className="font-extrabold text-lg text-white tracking-wide uppercase mt-1">
                PEMBERITAHUAN LATIHAN
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Hallo teman - teman GKPI Immanuel! 🎵
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

              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm font-bold">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Tanggal: {nextSchedule.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{nextSchedule.location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed px-1">
              Jangan lupa latihan hari {nextSchedule.day.toLowerCase()} ini ya, jangan sampai telat!
            </p>

            <button
              onClick={handleCloseScheduleNotice}
              className="w-full bg-[#C2F215] hover:bg-lime-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl uppercase tracking-widest transition-all shadow-lg shadow-lime-400/20 active:scale-95"
            >
              OKE, SIAP!
            </button>
          </div>
        </div>
      )}

      {/* POPUP IZIN NOTIFIKASI PERANGKAT */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95">

            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/30">
              <BellRing className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                IZINKAN NOTIFIKASI HP?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Izinkan kami mengirimkan pengingat latihan langsung ke HP kamu sekarang dan setiap 3 jam sekali agar tidak ketinggalan jadwal.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleAllowNotifications}
                className="w-full bg-[#C2F215] hover:bg-lime-400 text-slate-950 font-black text-xs py-3 rounded-2xl uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                IZINKAN NOTIFIKASI
              </button>

              <button
                onClick={handleDenyNotifications}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-2xl uppercase tracking-wider transition-all border border-slate-700 active:scale-95 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
                TIDAK, TERIMA KASIH
              </button>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              *Pilihan ini hanya akan ditanyakan 1x saja di HP kamu.
            </p>
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
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
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