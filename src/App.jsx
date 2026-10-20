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
  Music,
  Home,
  User,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  ExternalLink,
  Lock,
  AlertCircle,
  BookOpen,
  Users
} from 'lucide-react';

const LOGO_GKPI = 'src/assets/LOGO GKPI.png';

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

// DATA PETUGAS KEGIATAN NATAL
const NATAL_ROLES_DATA = [
  {
    title: 'MC (Master of Ceremony)',
    members: ['Sari', 'Boy / Axel / Doli']
  },
  {
    title: 'PROSESI DAN TARI LILIN',
    members: ['Cindy', 'May', 'Juli', 'Novi', 'Ketty']
  },
  {
    title: 'PENCIPTAAN (Ayat Alkitab)',
    members: [
      'Martin',
      'Lia Pakpahan',
      'Natasya',
      'Lia',
      'Doli',
      'Lina',
      'Misel'
    ]
  },
  {
    title: 'VOCAL SOLO Penciptaan',
    members: ['Keti']
  },
  {
    title: 'FRAGMEN',
    members: [
      'Roni',
      'Criston',
      'Martin',
      'Timoti',
      'Tasya',
      'Lia Sianturi'
    ]
  },
  {
    title: 'VOCAL SOLO Fragmen',
    members: ['Amanda Panjaitan']
  },
  {
    title: 'PROFESI PANITIA',
    members: [
      'Fiktor (Ketua)',
      'Cino (Wakil)',
      'Lia Sianturi (Sekretaris)',
      'Tasya (Bendahara)',
      'Natanael (Seksi Acara)',
      'Amanda (Penerima Tamu)',
      'Muti (Konsumsi)',
      'Axel / Boy (Humas)',
      'Timoti (Keamanan)'
    ]
  },
  {
    title: 'PEMBAWA PERSEMBAHAN',
    members: ['Ester', 'Lia Pakpahan', 'Roni', 'Kriston', 'Cia']
  },
  {
    title: 'OPERATOR Lampu',
    members: ['Axel']
  },
  {
    title: 'INFOKUS',
    members: ['Wiki', 'Jona']
  }
];

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

const GKPILoader = () => (
  <div className="fixed inset-0 bg-white text-slate-900 z-50 flex flex-col items-center justify-center p-4 font-sans">
    <div className="relative flex flex-col items-center max-w-sm w-full text-center space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="w-28 h-28 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 p-2">
          <img
            src={LOGO_GKPI}
            alt="Logo GKPI"
            className="w-full h-full object-contain drop-shadow-md animate-pulse"
          />
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-900 tracking-wider uppercase">
          GKPI IMMANUEL
        </h2>
        <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase">
          Resort Tanjung Mulia • Medan
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [filterDay, setFilterDay] = useState('SEMUA');
  const [filterMonth, setFilterMonth] = useState('SEMUA');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showNotice, setShowNotice] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('gkpi_isLoggedIn') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const VALID_USERNAME = 'pemuda';
  const VALID_PASSWORD = 'natal2026';
  const REDIRECT_URL = 'https://dokumentasi-orcin.vercel.app/';

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timer = setTimeout(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingSchedule = SCHEDULE_DATA.find((item) => {
        const scheduleDate = parseScheduleDate(item.date);
        return scheduleDate && scheduleDate >= today;
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
      } else {
        setNextSchedule(SCHEDULE_DATA[SCHEDULE_DATA.length - 1]);
        setDaysRemaining(0);
      }

      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleAccountTabClick = () => {
    if (!isLoggedIn) {
      setLoginError('');
      setShowLoginModal(true);
    } else {
      setActiveTab('account');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (usernameInput.trim().toLowerCase() === VALID_USERNAME && passwordInput === VALID_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('gkpi_isLoggedIn', 'true');
      setShowLoginModal(false);
      setLoginError('');
      setActiveTab('account');
      window.open(REDIRECT_URL, '_blank');
    } else {
      setLoginError('Username atau password salah! Coba periksa kembali.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('gkpi_isLoggedIn');
    setActiveTab('home');
  };

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
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-20 relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {isLoading && <GKPILoader />}

      {/* HEADER UTAMA */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm border border-slate-100">
              <img src={LOGO_GKPI} alt="Logo GKPI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight uppercase tracking-wide">
                GKPI IMMANUEL
              </h1>
              <p className="text-[11px] font-semibold text-blue-600">
                Resort Tanjung Mulia &bull; Medan
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNotice(true)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors text-slate-700"
            title="Pemberitahuan Latihan"
          >
            <Bell className="w-5 h-5" />
            {nextSchedule && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="max-w-md mx-auto px-4 pt-4 w-full flex-1">
        {/* TAB 1: BERANDA */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Shalom, Pemuda-Pemudi!</span>
              </div>
              <h2 className="text-lg font-bold leading-snug">
                Jadwal & Info Latihan Natal 2026
              </h2>
              <p className="text-xs text-blue-100/90 mt-1 font-normal">
                Persiapkan pelayanan terbaik kita untuk menyambut hari kelahiran Sang Juruselamat.
              </p>
            </div>

            {nextSchedule && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> LATIHAN TERDEKAT
                  </span>
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {daysRemaining === 0 ? 'HARI INI' : `${daysRemaining} Hari Lagi`}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {nextSchedule.day}, {nextSchedule.date}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5" /> {nextSchedule.activity}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {nextSchedule.location} &bull; Jam {nextSchedule.time}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSchedule(nextSchedule)}
                  className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-1"
                >
                  <Utensils className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lihat Info Konsumsi</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('schedule')}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm text-left hover:border-blue-300 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Semua Jadwal</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">22 Agenda latihan</p>
              </button>

              <button
                onClick={() => setActiveTab('roles')}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm text-left hover:border-blue-300 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Kegiatan Natal</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Petugas & Liturgi</p>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Catatan Penting Panitia
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-5 list-disc font-medium">
                <li>Harap hadir 10 menit sebelum jam latihan dimulai.</li>
                <li>Air mineral Clean Q disediakan gratis oleh panitia setiap latihan.</li>
                <li>Jadwal dengan tanda khusus menyajikan Roti & Bandrek Hangat!</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: JADWAL LENGKAP */}
        {activeTab === 'schedule' && (
          <div className="space-y-3.5">
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
                <span className="text-slate-400 shrink-0 text-[11px] font-bold mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Hari:
                </span>
                {['SEMUA', 'MINGGU', 'JUMAT', 'SENIN', 'KAMIS'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setFilterDay(day)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${filterDay === day
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold pt-1 border-t border-slate-100">
                <span className="text-slate-400 shrink-0 text-[11px] font-bold mr-1">Bulan:</span>
                {['SEMUA', 'Oktober', 'November', 'Desember'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMonth(m)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${filterMonth === m
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {filteredSchedule.map((item) => {
              const isSunday = item.day === 'MINGGU';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-blue-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center min-w-[70px] text-center border border-blue-100 shrink-0">
                      <span>{item.day.split(' ')[0]}</span>
                      <span className="text-[10px] text-blue-500 font-semibold mt-0.5">
                        {isSunday ? '14.00' : item.day === 'JUMAT' ? '18.30' : '19.00'}
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {item.date}
                      </div>
                      <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 truncate">
                        <Music className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.activity}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {item.time} &bull; {item.location}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSchedule(item)}
                    className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-[11px] px-3 py-2 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">KONSUMSI</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB KEGIATAN NATAL & TUGAS LITURGI */}
        {activeTab === 'roles' && (
          <div className="space-y-3.5">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-md space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-100 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-white" /> SUSUNAN & PETUGAS NATAL
              </div>
              <h3 className="font-extrabold text-base">Pembagian Kegiatan Pemuda</h3>
              <p className="text-[11px] text-amber-100/90 font-medium">
                Daftar nama liturgi, fragmen, solo, dan struktur panitia Natal.
              </p>
            </div>

            <div className="space-y-3">
              {NATAL_ROLES_DATA.map((role, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-xs text-blue-900 uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {role.title}
                    </h4>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {role.members.length} Orang/Bagian
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {role.members.map((member, mIdx) => (
                      <li
                        key={mIdx}
                        className="text-xs text-slate-700 font-semibold bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <span>{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AKUN SAYA */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm text-center space-y-3">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center p-3 shadow-md border-4 border-slate-50">
                <img src={LOGO_GKPI} alt="Logo GKPI" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Pemuda GKPI Immanuel</h3>
                <p className="text-xs text-slate-500 font-medium">Anggota Sektor Pemuda-Pemudi</p>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-3 py-0.5 rounded-full mt-1.5">
                  ✓ Terautentikasi (Sesi Aktif)
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4" /> DOKUMENTASI TERSEDIA
              </div>
              <h4 className="font-extrabold text-sm">
                Akses Galeri & Dokumentasi Natal
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Anda sudah terautentikasi secara permanen. Klik tombol di bawah ini untuk membuka tautan dokumentasi resmi kapan saja.
              </p>
              <a
                href={REDIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
              >
                <span>Buka Dokumentasi Orcin</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 text-xs font-medium text-slate-700">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Gereja
                </span>
                <span className="font-bold text-slate-900">GKPI Immanuel</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Resort
                </span>
                <span className="font-bold text-slate-900">Tanjung Mulia - Medan</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              Keluar / Logout
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Jadwal</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'roles' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Kegiatan</span>
          </button>

          <button
            onClick={handleAccountTabClick}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'account' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Akun</span>
          </button>
        </div>
      </nav>

      {/* MODAL FORM LOGIN USERNAME & PASSWORD */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto p-1.5 shadow-md border border-slate-100">
                <img src={LOGO_GKPI} alt="Logo GKPI" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                LOGIN ANGGOTA PEMUDA
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan kredensial resmi pemuda untuk masuk.
              </p>
            </div>

            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk & Buka Dokumentasi</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP NOTIFIKASI DINAMIS */}
      {!isLoading && showNotice && nextSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl text-center space-y-4 relative border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>

            <div>
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
                {daysRemaining === 0 ? 'HARI INI BGT!' : `${daysRemaining} HARI LAGI`}
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                PEMBERITAHUAN LATIHAN
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-blue-600">{nextSchedule.day}</span>
                <span className="text-slate-500 font-semibold">{nextSchedule.time}</span>
              </div>
              <p className="font-bold text-slate-800">{nextSchedule.date}</p>
              <p className="text-slate-600 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-blue-600" /> {nextSchedule.activity}
              </p>
            </div>

            <button
              onClick={handleCloseScheduleNotice}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              SIAP LATIHAN!
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETAIL KONSUMSI */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase">
                  {selectedSchedule.day} &bull; {selectedSchedule.time}
                </span>
                <h3 className="font-extrabold text-sm text-white">
                  {selectedSchedule.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {selectedSchedule.hasSpecialSnack ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-amber-900 text-sm">
                    KONSUMSI SPESIAL!
                  </h4>
                  <div className="bg-white border border-amber-200 rounded-xl p-2.5 font-bold text-amber-800">
                    MAKAN ROTI & MINUM BANDREK
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                    ✓ Gratis Disediakan Panitia
                  </span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center space-y-2">
                  <Droplets className="w-6 h-6 text-blue-600 mx-auto" />
                  <h4 className="font-bold text-blue-900 text-sm">
                    AIR MINERAL CLEAN Q
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    {selectedSchedule.snackNote}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="bg-slate-900 text-white font-bold px-5 py-2 rounded-xl text-xs"
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