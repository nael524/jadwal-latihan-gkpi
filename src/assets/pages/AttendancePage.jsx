import React, { useState, useEffect } from 'react';
import logo from '../Logo.png';
import { supabase } from '../../supabaseClient';
import {
    UserCheck,
    CheckCircle2,
    Search,
    Send,
    ArrowLeft,
    Calendar,
    Loader2,
    BarChart3,
    Check,
    CheckSquare,
    XSquare,
    Users,
    Clock,
    Award,
    Filter
} from 'lucide-react';

const MEMBERS_BY_CATEGORY = {
    'Latihan Koor Natal': [
        { id: 'k1', name: 'Mutiara Panjaitan' },
        { id: 'k2', name: 'Manda Panjaitan' },
        { id: 'k3', name: 'Lia Pakpahan' },
        { id: 'k4', name: 'Sari' },
        { id: 'k5', name: 'Lia Sianturi' },
        { id: 'k6', name: 'July' },
        { id: 'k7', name: 'Mayka' },
        { id: 'k8', name: 'Annisa Simanungkalit' },
        { id: 'k9', name: 'Kety' },
        { id: 'k10', name: 'Meli' },
        { id: 'k11', name: 'Misel' },
        { id: 'k12', name: 'Ayu' },
        { id: 'k13', name: 'Natanael' },
        { id: 'k14', name: 'Doli' },
        { id: 'k15', name: 'Roni' },
        { id: 'k16', name: 'Timoti' },
        { id: 'k17', name: 'Fiktor' },
        { id: 'k18', name: 'Axel' },
        { id: 'k19', name: 'Cino' },
        { id: 'k20', name: 'Boy' },
        { id: 'k21', name: 'Natasya' },
        { id: 'k22', name: 'Lina' },
        { id: 'k23', name: 'Wiki' },
        { id: 'k24', name: 'David' },
        { id: 'k25', name: 'Jona' },
        { id: 'k26', name: 'Cia Pasaribu' }
    ],
    'Latihan Kegiatan Natal': [
        { id: 'g1', name: 'Lia Pakpahan' },
        { id: 'g2', name: 'Sari' },
        { id: 'g3', name: 'Lia Sianturi' },
        { id: 'g4', name: 'Juli' },
        { id: 'g5', name: 'Kety' },
        { id: 'g6', name: 'Misel' },
        { id: 'g7', name: 'Doli' },
        { id: 'g8', name: 'Roni' },
        { id: 'g9', name: 'Kriston' },
        { id: 'g10', name: 'Timoti' },
        { id: 'g11', name: 'Fiktor' },
        { id: 'g12', name: 'Natanael' },
        { id: 'g13', name: 'Axel' },
        { id: 'g14', name: 'Cino' },
        { id: 'g15', name: 'Boy' },
        { id: 'g16', name: 'Natasya' },
        { id: 'g17', name: 'Lina' },
        { id: 'g18', name: 'May' },
        { id: 'g19', name: 'Cindy' },
        { id: 'g20', name: 'Cia Pasaribu' },
        { id: 'g21', name: 'Martin' },
        { id: 'g22', name: 'Mayka Sitompul' }
    ]
};

// Normalisasi alias nama yang sama antar kategori agar rekap terakumulasi akurat
const NAME_ALIASES = {
    'Juli': 'July',
    'Mayka Sitompul': 'Mayka'
};

// Menggabungkan semua ID (k* dan g*) untuk setiap anggota unik agar total rekap akurat
const ALL_UNIQUE_MEMBERS = (() => {
    const combined = [
        ...MEMBERS_BY_CATEGORY['Latihan Koor Natal'].map((m) => ({ ...m, category: 'Koor' })),
        ...MEMBERS_BY_CATEGORY['Latihan Kegiatan Natal'].map((m) => ({ ...m, category: 'Kegiatan' }))
    ];
    const uniqueMap = new Map();

    combined.forEach((item) => {
        const normalizedName = NAME_ALIASES[item.name] || item.name;
        if (!uniqueMap.has(normalizedName)) {
            uniqueMap.set(normalizedName, {
                id: item.id,
                name: normalizedName,
                memberIds: [String(item.id)],
                categories: [item.category]
            });
        } else {
            const existing = uniqueMap.get(normalizedName);
            if (!existing.memberIds.includes(String(item.id))) {
                existing.memberIds.push(String(item.id));
            }
            if (!existing.categories.includes(item.category)) {
                existing.categories.push(item.category);
            }
        }
    });

    return Array.from(uniqueMap.values());
})();

export default function AttendancePage({ scheduleData = [], onBack }) {
    const [activeTab, setActiveTab] = useState('input');
    const [selectedScheduleId, setSelectedScheduleId] = useState(
        scheduleData && scheduleData.length > 0 ? scheduleData[0].id : 1
    );
    const [members, setMembers] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [rekapData, setRekapData] = useState([]);
    const [isRekapLoading, setIsRekapLoading] = useState(false);
    const [rekapSearchQuery, setRekapSearchQuery] = useState('');
    const [rekapCategoryFilter, setRekapCategoryFilter] = useState('ALL');

    const selectedScheduleObj = scheduleData.find((s) => s.id === selectedScheduleId);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const activityName = selectedScheduleObj?.activity || 'Latihan Koor Natal';
                let categoryKey = activityName.toLowerCase().includes('koor')
                    ? 'Latihan Koor Natal'
                    : 'Latihan Kegiatan Natal';
                const currentMembers = MEMBERS_BY_CATEGORY[categoryKey];
                setMembers(currentMembers);

                const { data: sessionInfo } = await supabase
                    .from('attendance_sessions')
                    .select('status')
                    .eq('schedule_id', selectedScheduleId)
                    .maybeSingle();

                setIsSaved(sessionInfo?.status === 'SUBMITTED');

                const { data: attDetails } = await supabase
                    .from('attendance_details')
                    .select('member_id, status')
                    .eq('schedule_id', selectedScheduleId);

                const newMap = {};

                if (attDetails && attDetails.length > 0) {
                    setIsSaved(true);
                    currentMembers.forEach((m) => {
                        newMap[m.id] = '';
                    });
                    attDetails.forEach((item) => {
                        newMap[String(item.member_id)] = item.status;
                    });
                } else {
                    setIsSaved(false);
                    currentMembers.forEach((m) => {
                        newMap[m.id] = '';
                    });
                }

                setAttendanceMap(newMap);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (activeTab === 'input') loadData();
    }, [selectedScheduleId, selectedScheduleObj, activeTab]);

    useEffect(() => {
        const fetchRekap = async () => {
            if (activeTab !== 'rekap') return;
            setIsRekapLoading(true);
            try {
                // Hanya ambil data dari sesi yang sudah SUBMITTED agar selaras dengan presensi terfinalisasi
                const { data: submittedSessions } = await supabase
                    .from('attendance_sessions')
                    .select('schedule_id')
                    .eq('status', 'SUBMITTED');

                const validScheduleIds = new Set(
                    (submittedSessions || []).map((s) => Number(s.schedule_id))
                );

                const { data: allAttDetails } = await supabase
                    .from('attendance_details')
                    .select('schedule_id, member_id, status');

                const validDetails = (allAttDetails || []).filter((d) =>
                    validScheduleIds.size > 0 ? validScheduleIds.has(Number(d.schedule_id)) : true
                );

                const summary = ALL_UNIQUE_MEMBERS.map((m) => {
                    // Cocokkan semua ID milik anggota tersebut (baik ID Koor maupun ID Kegiatan)
                    const records = validDetails.filter((d) =>
                        m.memberIds.includes(String(d.member_id))
                    );

                    const hadir = records.filter((d) => d.status === 'Hadir').length;
                    const izin = records.filter((d) => d.status === 'Izin').length;
                    const sakit = records.filter((d) => d.status === 'Sakit').length;
                    const alfa = records.filter((d) => d.status === 'Alfa').length;
                    const total = records.length;
                    const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;

                    return {
                        id: m.id,
                        name: m.name,
                        categories: m.categories,
                        hadir,
                        izin,
                        sakit,
                        alfa,
                        total,
                        persentase
                    };
                });

                setRekapData(summary);
            } catch (err) {
                console.error(err);
            } finally {
                setIsRekapLoading(false);
            }
        };

        fetchRekap();
    }, [activeTab]);

    const handleSetAllStatus = (targetStatus) => {
        const updatedMap = {};
        members.forEach((m) => {
            updatedMap[m.id] = targetStatus;
        });
        setAttendanceMap(updatedMap);
    };

    const handleSave = async () => {
        const unassigned = members.filter((m) => !attendanceMap[m.id]);
        if (unassigned.length > 0) {
            alert(
                `Ada ${unassigned.length} anggota yang belum dipilih status presensinya! Silakan tentukan statusnya terlebih dahulu.`
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const hadir = Object.values(attendanceMap).filter((v) => v === 'Hadir').length;
            const izin = Object.values(attendanceMap).filter((v) => v === 'Izin').length;
            const sakit = Object.values(attendanceMap).filter((v) => v === 'Sakit').length;
            const alfa = Object.values(attendanceMap).filter((v) => v === 'Alfa').length;

            const { data: sessionData, error: sErr } = await supabase
                .from('attendance_sessions')
                .upsert(
                    [
                        {
                            schedule_id: selectedScheduleId,
                            title: `Absensi - ${selectedScheduleObj?.activity || 'Latihan'}`,
                            total_members: members.length,
                            total_hadir: hadir,
                            total_izin: izin,
                            total_sakit: sakit,
                            total_alfa: alfa,
                            status: 'SUBMITTED'
                        }
                    ],
                    { onConflict: 'schedule_id' }
                )
                .select();

            if (sErr) throw sErr;

            const sessionId = sessionData[0]?.id;
            const detailsToUpsert = members.map((m) => ({
                session_id: sessionId,
                schedule_id: selectedScheduleId,
                member_id: String(m.id),
                status: attendanceMap[m.id]
            }));

            const { error: dErr } = await supabase
                .from('attendance_details')
                .upsert(detailsToUpsert, { onConflict: 'schedule_id,member_id' });

            if (dErr) throw dErr;

            setIsSaved(true);
            setShowSuccessModal(true);
        } catch (err) {
            alert('Gagal menyimpan absensi: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hitung statistik harian secara langsung
    const dailyStats = {
        hadir: Object.values(attendanceMap).filter((v) => v === 'Hadir').length,
        izin: Object.values(attendanceMap).filter((v) => v === 'Izin').length,
        sakit: Object.values(attendanceMap).filter((v) => v === 'Sakit').length,
        alfa: Object.values(attendanceMap).filter((v) => v === 'Alfa').length,
        filled: Object.values(attendanceMap).filter((v) => Boolean(v)).length
    };

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredRekap = rekapData.filter((m) => {
        const matchesName = m.name.toLowerCase().includes(rekapSearchQuery.toLowerCase());
        const matchesCategory =
            rekapCategoryFilter === 'ALL' || m.categories.includes(rekapCategoryFilter);
        return matchesName && matchesCategory;
    });

    const overallAttendanceRate =
        rekapData.length > 0
            ? Math.round(
                rekapData.reduce((acc, item) => acc + item.persentase, 0) / rekapData.length
            )
            : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 text-slate-800 flex flex-col justify-between pb-10 font-sans">
            {/* Header dengan gradasi biru profesional */}
            <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white px-4 pt-4 pb-12 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-10 bottom-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />

                <div className="max-w-3xl mx-auto flex items-center justify-between relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 text-sky-200" /> Kembali
                    </button>

                    <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl">
                        <div className="text-right">
                            <span className="block text-xs font-extrabold tracking-wide text-white">
                                Presensi Panitia
                            </span>
                            <span className="block text-[10px] font-semibold text-sky-200">
                                GKPI Immanuel
                            </span>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-xl p-1 flex items-center justify-center shadow-xs">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-4 relative z-10">
                    <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                        Sistem Manajemen Kehadiran Natal
                    </h1>
                    <p className="text-[11px] text-blue-100/80 mt-0.5">
                        Pencatatan kehadiran latihan koor & kegiatan panitia secara terintegrasi
                    </p>
                </div>
            </header>

            {/* Navigasi Tab Mengambang */}
            <div className="max-w-3xl w-full mx-auto px-4 -mt-7 relative z-20">
                <div className="bg-white p-1.5 rounded-2xl shadow-md border border-blue-100/80 flex gap-1.5">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'input'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" /> Presensi Harian
                    </button>
                    <button
                        onClick={() => setActiveTab('rekap')}
                        className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'rekap'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" /> Total Rekap Kehadiran
                    </button>
                </div>
            </div>

            {/* Konten Utama */}
            <main className="max-w-3xl w-full mx-auto px-4 pt-4 flex-1 space-y-4">
                {activeTab === 'input' ? (
                    <>
                        {/* Kartu Pemilihan Jadwal */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    Jadwal Kegiatan Latihan
                                </span>
                                {isSaved ? (
                                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terfinalisasi
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-amber-600" /> Belum Disimpan
                                    </span>
                                )}
                            </div>

                            <select
                                value={selectedScheduleId}
                                onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
                                className="w-full bg-slate-50 hover:bg-blue-50/40 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                            >
                                {scheduleData.map((s) => {
                                    const displayDate =
                                        s.date && s.date !== 'STAY TUNED' ? `, ${s.date}` : '';
                                    return (
                                        <option key={s.id} value={s.id}>
                                            [{s.day}
                                            {displayDate}] {s.activity}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Ringkasan Statistik Sesi Harian */}
                            <div className="grid grid-cols-4 gap-2 pt-1">
                                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
                                    <span className="block text-[10px] font-bold text-emerald-600">Hadir</span>
                                    <span className="text-sm font-black text-emerald-700">{dailyStats.hadir}</span>
                                </div>
                                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2 text-center">
                                    <span className="block text-[10px] font-bold text-amber-600">Izin</span>
                                    <span className="text-sm font-black text-amber-700">{dailyStats.izin}</span>
                                </div>
                                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2 text-center">
                                    <span className="block text-[10px] font-bold text-blue-600">Sakit</span>
                                    <span className="text-sm font-black text-blue-700">{dailyStats.sakit}</span>
                                </div>
                                <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2 text-center">
                                    <span className="block text-[10px] font-bold text-rose-600">Alfa</span>
                                    <span className="text-sm font-black text-rose-700">{dailyStats.alfa}</span>
                                </div>
                            </div>
                        </div>

                        {/* Baris Akses Cepat & Pencarian */}
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                                        Aksi Massal
                                    </span>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                        {dailyStats.filled}/{members.length} Terisi
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSetAllStatus('Hadir')}
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Semua Hadir
                                    </button>
                                    <button
                                        onClick={() => handleSetAllStatus('Alfa')}
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <XSquare className="w-3.5 h-3.5 text-rose-600" /> Semua Alfa
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama anggota..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Daftar Anggota */}
                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="bg-white rounded-2xl border border-slate-200/80 text-center py-12 text-xs text-slate-500 font-semibold flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <span>Memuat daftar anggota...</span>
                                </div>
                            ) : (
                                filteredMembers.map((m, index) => (
                                    <div
                                        key={m.id}
                                        className="bg-white p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 shadow-2xs flex items-center justify-between gap-3 transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 text-blue-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                                                {index + 1}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 truncate">
                                                {m.name}
                                            </span>
                                        </div>

                                        <select
                                            value={attendanceMap[m.id] || ''}
                                            onChange={(e) =>
                                                setAttendanceMap({ ...attendanceMap, [m.id]: e.target.value })
                                            }
                                            className={`text-[11px] font-extrabold px-3 py-2 rounded-xl border transition-all cursor-pointer shrink-0 ${attendanceMap[m.id] === 'Hadir'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                    : attendanceMap[m.id] === 'Izin'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                                                        : attendanceMap[m.id] === 'Sakit'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                                                            : attendanceMap[m.id] === 'Alfa'
                                                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                                                : 'bg-slate-100 text-slate-500 border-slate-300 font-semibold'
                                                }`}
                                        >
                                            <option value="" disabled>
                                                -- Pilih Status --
                                            </option>
                                            <option value="Hadir">Hadir</option>
                                            <option value="Izin">Izin</option>
                                            <option value="Sakit">Sakit</option>
                                            <option value="Alfa">Alfa</option>
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Tombol Finalisasi */}
                        <div className="pt-2">
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || isLoading}
                                className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${isSaved
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                                        : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isSaved ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span>
                                    {isSaved ? 'UPDATE FINALISASI ABSENSI' : 'SIMPAN FINALISASI ABSENSI'}
                                </span>
                            </button>
                        </div>
                    </>
                ) : (
                    /* TAB TOTAL REKAP KEHADIRAN */
                    <div className="space-y-4">
                        {/* Kartu Ringkasan Rekap Keseluruhan */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-sky-200" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-semibold text-blue-100">
                                        Total Panitia Terdata
                                    </span>
                                    <span className="text-lg font-black">{rekapData.length} Orang</span>
                                </div>
                            </div>

                            <div className="bg-white border border-blue-100 p-3.5 rounded-2xl shadow-xs flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-500">
                                        Rata-rata Kehadiran
                                    </span>
                                    <span className="text-lg font-black text-blue-700">
                                        {overallAttendanceRate}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Filter & Pencarian Rekap */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama anggota di total rekap..."
                                    value={rekapSearchQuery}
                                    onChange={(e) => setRekapSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                                <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
                                {[
                                    { key: 'ALL', label: 'Semua Anggota' },
                                    { key: 'Koor', label: 'Latihan Koor' },
                                    { key: 'Kegiatan', label: 'Latihan Kegiatan' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setRekapCategoryFilter(tab.key)}
                                        className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${rekapCategoryFilter === tab.key
                                                ? 'bg-blue-600 text-white shadow-2xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tabel Rekap */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border-b border-blue-100 px-4 py-3 grid grid-cols-12 text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
                                <div className="col-span-5">Nama Anggota</div>
                                <div className="col-span-4 text-center">H / I / S / A</div>
                                <div className="col-span-3 text-right">Kehadiran</div>
                            </div>

                            {isRekapLoading ? (
                                <div className="text-center py-12 text-xs text-slate-500 font-semibold flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <span>Menghitung total rekap...</span>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredRekap.map((item) => (
                                        <div
                                            key={item.id}
                                            className="px-4 py-3 grid grid-cols-12 items-center text-xs hover:bg-blue-50/30 transition-colors"
                                        >
                                            <div className="col-span-5 pr-2">
                                                <div className="font-bold text-slate-800 truncate">
                                                    {item.name}
                                                </div>
                                                <div className="flex gap-1 mt-0.5">
                                                    {item.categories.map((cat) => (
                                                        <span
                                                            key={cat}
                                                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${cat === 'Koor'
                                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                                                                    : 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                                                                }`}
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-span-4 text-center text-[11px] font-extrabold">
                                                <span className="text-emerald-600">{item.hadir}</span>
                                                <span className="text-slate-300 mx-1">/</span>
                                                <span className="text-amber-600">{item.izin}</span>
                                                <span className="text-slate-300 mx-1">/</span>
                                                <span className="text-blue-600">{item.sakit}</span>
                                                <span className="text-slate-300 mx-1">/</span>
                                                <span className="text-rose-600">{item.alfa}</span>
                                            </div>

                                            <div className="col-span-3 flex flex-col items-end gap-1">
                                                <span
                                                    className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.persentase >= 75
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : item.persentase >= 50
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                                        }`}
                                                >
                                                    {item.persentase}%
                                                </span>
                                                <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${item.persentase >= 75
                                                                ? 'bg-emerald-500'
                                                                : item.persentase >= 50
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-rose-500'
                                                            }`}
                                                        style={{ width: `${item.persentase}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Sukses */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl text-center space-y-4 relative border border-blue-100">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                            <Check className="w-7 h-7 stroke-[3]" />
                        </div>

                        <div>
                            <h3 className="font-extrabold text-base text-slate-900">
                                Berhasil Difinalisasi!
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Data presensi panitia telah resmi tersimpan dan otomatis terakumulasi di
                                Total Rekap.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}