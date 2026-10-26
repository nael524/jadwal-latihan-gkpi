import React, { useState, useEffect } from 'react';
import logo from '../assets/LOGO GKPI.png';
import { supabase } from '../supabaseClient';
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
    XSquare
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
        { id: 'k8', name: 'Nisa' },
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
        { id: 'k26', name: 'Cia Pasaribu' },
        { id: 'k27', name: 'Annisa' }
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

// Menggabungkan seluruh anggota unik dari kedua kategori untuk tabel Rekap Global
const ALL_UNIQUE_MEMBERS = (() => {
    const combined = [
        ...MEMBERS_BY_CATEGORY['Latihan Koor Natal'],
        ...MEMBERS_BY_CATEGORY['Latihan Kegiatan Natal']
    ];
    const uniqueMap = new Map();
    combined.forEach((item) => {
        if (!uniqueMap.has(item.name)) {
            uniqueMap.set(item.name, item);
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

    const selectedScheduleObj = scheduleData.find((s) => s.id === selectedScheduleId);

    // 1. Memuat data presensi harian sesuai jadwal kegiatan yang dipilih
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const activityName = selectedScheduleObj?.activity || 'Latihan Koor Natal';
                let categoryKey = activityName.toLowerCase().includes('koor') ? 'Latihan Koor Natal' : 'Latihan Kegiatan Natal';
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
                    currentMembers.forEach((m) => { newMap[m.id] = ''; });
                    attDetails.forEach((item) => {
                        newMap[String(item.member_id)] = item.status;
                    });
                } else {
                    setIsSaved(false);
                    currentMembers.forEach((m) => { newMap[m.id] = ''; });
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

    // 2. Memuat data rekapitulasi GLOBAL (Menampilkan SELURUH anggota dari semua input kegiatan)
    useEffect(() => {
        const fetchRekap = async () => {
            if (activeTab !== 'rekap') return;
            setIsRekapLoading(true);
            try {
                // Tarik seluruh detail kehadiran dari Supabase tanpa filter jadwal
                const { data: allAttDetails } = await supabase
                    .from('attendance_details')
                    .select('member_id, status');

                // Hitung kumulasi presensi untuk setiap anggota unik
                const summary = ALL_UNIQUE_MEMBERS.map((m) => {
                    const records = (allAttDetails || []).filter((d) => String(d.member_id) === String(m.id));
                    const hadir = records.filter((d) => d.status === 'Hadir').length;
                    const izin = records.filter((d) => d.status === 'Izin').length;
                    const sakit = records.filter((d) => d.status === 'Sakit').length;
                    const alfa = records.filter((d) => d.status === 'Alfa').length;
                    const total = records.length;
                    const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;
                    return { id: m.id, name: m.name, hadir, izin, sakit, alfa, persentase };
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

    // Fungsi Akses Cepat Presensi
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
            alert(`Ada ${unassigned.length} anggota yang belum dipilih status presensinya! Silakan tentukan statusnya terlebih dahulu.`);
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
                .upsert([
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
                ], { onConflict: 'schedule_id' })
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

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredRekap = rekapData.filter((m) =>
        m.name.toLowerCase().includes(rekapSearchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between pb-8 font-sans">
            {/* HEADER MOBILE */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-xs">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-blue-600" /> Kembali
                </button>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <span className="block text-xs font-extrabold text-slate-800">Presensi Panitia</span>
                        <span className="text-[10px] font-semibold text-blue-600">GKPI Immanuel</span>
                    </div>
                    <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
                </div>
            </header>

            {/* TAB NAVIGASI */}
            <div className="px-4 pt-3">
                <div className="flex bg-slate-200/70 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'input' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                    >
                        <UserCheck className="w-4 h-4" /> Presensi Harian
                    </button>
                    <button
                        onClick={() => setActiveTab('rekap')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'rekap' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                    >
                        <BarChart3 className="w-4 h-4" /> Total Rekap Kehadiran
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="px-4 pt-3 flex-1 space-y-3">
                {activeTab === 'input' ? (
                    <>
                        {/* CARD JADWAL */}
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-blue-600" /> Jadwal Kegiatan
                                </span>
                                {isSaved ? (
                                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terfinalisasi
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                        Belum Disimpan
                                    </span>
                                )}
                            </div>
                            <select
                                value={selectedScheduleId}
                                onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                            >
                                {scheduleData.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        [{s.day}] {s.activity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* AKSES CEPAT & PENCARIAN */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Akses Cepat</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSetAllStatus('Hadir')}
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Set Semua Hadir
                                    </button>
                                    <button
                                        onClick={() => handleSetAllStatus('Alfa')}
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <XSquare className="w-3.5 h-3.5 text-rose-600" /> Set Semua Alfa
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama anggota..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* LIST DAFTAR ANGGOTA */}
                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="text-center py-8 text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Memuat data...
                                </div>
                            ) : (
                                filteredMembers.map((m) => (
                                    <div key={m.id} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-800 truncate">{m.name}</span>
                                        <select
                                            value={attendanceMap[m.id] || ''}
                                            onChange={(e) => setAttendanceMap({ ...attendanceMap, [m.id]: e.target.value })}
                                            className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border cursor-pointer ${attendanceMap[m.id] === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                attendanceMap[m.id] === 'Izin' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                                    attendanceMap[m.id] === 'Sakit' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                                        attendanceMap[m.id] === 'Alfa' ? 'bg-rose-50 text-rose-700 border-rose-300' :
                                                            'bg-slate-100 text-slate-400 border-slate-300 font-semibold'
                                                }`}
                                        >
                                            <option value="" disabled>-- Pilih Status --</option>
                                            <option value="Hadir">Hadir</option>
                                            <option value="Izin">Izin</option>
                                            <option value="Sakit">Sakit</option>
                                            <option value="Alfa">Alfa</option>
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* BUTTON SIMPAN FINALISASI */}
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting || isLoading}
                            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                            <span>{isSaved ? 'UPDATE FINALISASI ABSENSI' : 'SIMPAN FINALISASI ABSENSI'}</span>
                        </button>
                    </>
                ) : (
                    /* REKAP TABEL AKUMULASI GABUNGAN SELURUH NAMA ANGGOTA */
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Cari nama di rekap..."
                                value={rekapSearchQuery}
                                onChange={(e) => setRekapSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                            <div className="bg-slate-100/80 px-4 py-2.5 grid grid-cols-12 text-[10px] font-extrabold text-slate-500 uppercase">
                                <div className="col-span-6">Nama Anggota</div>
                                <div className="col-span-4 text-center">H / I / S / A</div>
                                <div className="col-span-2 text-right">%</div>
                            </div>

                            {isRekapLoading ? (
                                <div className="text-center py-8 text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Memuat rekap...
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredRekap.map((item) => (
                                        <div key={item.id} className="px-4 py-3 grid grid-cols-12 items-center text-xs">
                                            <div className="col-span-6 font-bold text-slate-800 truncate">{item.name}</div>
                                            <div className="col-span-4 text-center text-[10px] font-bold text-slate-600">
                                                <span className="text-emerald-600">{item.hadir}</span> / <span className="text-amber-600">{item.izin}</span> / <span className="text-blue-600">{item.sakit}</span> / <span className="text-rose-600">{item.alfa}</span>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                                                    {item.persentase}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL BERHASIL DISIMPAN */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-2xl text-center space-y-3 relative border border-slate-100">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                            <Check className="w-6 h-6 stroke-[3]" />
                        </div>

                        <div>
                            <h3 className="font-extrabold text-sm text-slate-900">Berhasil Disimpan!</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Data presensi panitia telah resmi tersimpan.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}