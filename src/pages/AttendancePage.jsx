import React, { useState, useEffect } from 'react';
import logo from '../assets/LOGO GKPI.png';
import { supabase } from '../supabaseClient';
import {
    UserCheck,
    CheckCircle2,
    Search,
    CheckSquare,
    XSquare,
    RotateCcw,
    Send,
    ArrowLeft,
    Calendar,
    AlertCircle,
    Loader2
} from 'lucide-react';

// 2 KATEGORI KEGIATAN UTAMA
const MEMBERS_BY_CATEGORY = {
    'Latihan Koor Natal': [
        { id: 'k1', name: 'Mayka Sitompul' },
        { id: 'k2', name: 'Mutiara Panjaitan' },
        { id: 'k3', name: 'Ayu Sibagariang' },
        { id: 'k4', name: 'Natanael Sibagariang' }
    ],
    'Latihan Kegiatan Natal': [
        { id: 'g1', name: 'Ester Simanjuntak' },
        { id: 'g2', name: 'Gabriel Sitompul' },
        { id: 'g3', name: 'Hannah Nainggolan' },
        { id: 'g4', name: 'Ivan Tampubolon' }
    ]
};

export default function AttendancePage({ scheduleData = [], onBack }) {
    const [selectedScheduleId, setSelectedScheduleId] = useState(
        scheduleData && scheduleData.length > 0 ? scheduleData[0].id : 1
    );
    const [members, setMembers] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [notesMap, setNotesMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const selectedScheduleObj = scheduleData.find((s) => s.id === selectedScheduleId);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const activityName = selectedScheduleObj?.activity || 'Latihan Koor Natal';

                // Menyesuaikan kategori kegiatan
                let categoryKey = 'Latihan Koor Natal';
                if (activityName.toLowerCase().includes('koor')) {
                    categoryKey = 'Latihan Koor Natal';
                } else {
                    categoryKey = 'Latihan Kegiatan Natal';
                }

                const currentMemberList = MEMBERS_BY_CATEGORY[categoryKey];

                // Tarik data dari Supabase jika ada
                const { data: memberList } = await supabase
                    .from('members')
                    .select('id, name, category')
                    .eq('category', categoryKey)
                    .order('name', { ascending: true });

                const activeMembers = (memberList && memberList.length > 0) ? memberList : currentMemberList;
                setMembers(activeMembers);

                // Tarik data absensi yang sudah tersimpan
                const { data: attDetails } = await supabase
                    .from('attendance_details')
                    .select('member_id, status, notes')
                    .eq('schedule_id', selectedScheduleId);

                const newMap = {};
                const newNotes = {};

                activeMembers.forEach((m) => {
                    newMap[m.id] = 'Hadir';
                    newNotes[m.id] = '';
                });

                if (attDetails && attDetails.length > 0) {
                    attDetails.forEach((item) => {
                        newMap[item.member_id] = item.status;
                        newNotes[item.member_id] = item.notes || '';
                    });
                }

                setAttendanceMap(newMap);
                setNotesMap(newNotes);
            } catch (err) {
                console.error('Error loading data:', err);
                setMembers(MEMBERS_BY_CATEGORY['Latihan Koor Natal']);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedScheduleId, selectedScheduleObj]);

    const totalCount = members.length;
    const hadirCount = Object.values(attendanceMap).filter((v) => v === 'Hadir').length;
    const izinCount = Object.values(attendanceMap).filter((v) => v === 'Izin').length;
    const sakitCount = Object.values(attendanceMap).filter((v) => v === 'Sakit').length;
    const alfaCount = Object.values(attendanceMap).filter((v) => v === 'Alfa').length;

    const handleBulkSet = (status) => {
        const updated = {};
        members.forEach((m) => {
            updated[m.id] = status;
        });
        setAttendanceMap(updated);
    };

    const handleStatusChange = (memberId, status) => {
        setAttendanceMap((prev) => ({ ...prev, [memberId]: status }));
    };

    const handleNoteChange = (memberId, note) => {
        setNotesMap((prev) => ({ ...prev, [memberId]: note }));
    };

    const handleFinalizeSubmit = async () => {
        setIsSubmitting(true);
        setShowConfirmModal(false);

        try {
            const { data: sessionData, error: sErr } = await supabase
                .from('attendance_sessions')
                .upsert(
                    [
                        {
                            schedule_id: selectedScheduleId,
                            title: `Absensi - ${selectedScheduleObj?.activity || 'Latihan'}`,
                            total_members: totalCount,
                            total_hadir: hadirCount,
                            total_izin: izinCount,
                            total_sakit: sakitCount,
                            total_alfa: alfaCount,
                            status: 'SUBMITTED',
                            submitted_at: new Date().toISOString()
                        }
                    ],
                    { onConflict: 'schedule_id' }
                )
                .select();

            if (sErr) throw sErr;

            const sessionId = sessionData && sessionData[0] ? sessionData[0].id : null;

            const detailsToUpsert = members.map((m) => ({
                session_id: sessionId,
                schedule_id: selectedScheduleId,
                member_id: m.id,
                status: attendanceMap[m.id] || 'Hadir',
                notes: notesMap[m.id] || '',
                updated_at: new Date().toISOString()
            }));

            const { error: dErr } = await supabase
                .from('attendance_details')
                .upsert(detailsToUpsert, { onConflict: 'schedule_id,member_id' });

            if (dErr) throw dErr;

            setSuccessMessage('Data absensi berhasil disimpan.');
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            alert('Gagal menyimpan absensi: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-12 font-sans">
            {/* HEADER UTAMA */}
            <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 py-3.5 shadow-md">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all border border-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <h1 className="text-xs font-bold tracking-wider uppercase text-white">
                                Presensi Anggota
                            </h1>
                            <p className="text-[10px] font-medium text-blue-400">
                                GKPI Immanuel
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                            <img src={logo} alt="Logo GKPI" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </header>

            {/* KONTEN UTAMA */}
            <main className="max-w-md mx-auto px-4 pt-4 w-full flex-1 space-y-4">

                {/* PILIH JADWAL */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Pilih Jadwal Kegiatan:
                    </label>
                    <select
                        value={selectedScheduleId}
                        onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    >
                        {scheduleData.map((s) => (
                            <option key={s.id} value={s.id}>
                                [{s.day}, {s.date}] — {s.activity}
                            </option>
                        ))}
                    </select>

                    {selectedScheduleObj && (
                        <div className="text-[11px] text-slate-600 font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                            <span>Waktu: <strong className="text-slate-800">{selectedScheduleObj.time}</strong></span>
                            <span>Lokasi: <strong className="text-slate-800">{selectedScheduleObj.location}</strong></span>
                        </div>
                    )}
                </div>

                {/* RINGKASAN STATISTIK */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                    <div className="bg-white border-l-4 border-emerald-500 p-2.5 rounded-lg shadow-sm border-t border-r border-b border-slate-200">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">HADIR</span>
                        <span className="text-base font-bold text-slate-800">{hadirCount}</span>
                    </div>
                    <div className="bg-white border-l-4 border-amber-500 p-2.5 rounded-lg shadow-sm border-t border-r border-b border-slate-200">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">IZIN</span>
                        <span className="text-base font-bold text-slate-800">{izinCount}</span>
                    </div>
                    <div className="bg-white border-l-4 border-blue-500 p-2.5 rounded-lg shadow-sm border-t border-r border-b border-slate-200">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">SAKIT</span>
                        <span className="text-base font-bold text-slate-800">{sakitCount}</span>
                    </div>
                    <div className="bg-white border-l-4 border-rose-500 p-2.5 rounded-lg shadow-sm border-t border-r border-b border-slate-200">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">ALFA</span>
                        <span className="text-base font-bold text-slate-800">{alfaCount}</span>
                    </div>
                </div>

                {/* AKSES CEPAT & PENCARIAN */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Akses Cepat
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => handleBulkSet('Hadir')}
                                className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-semibold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                            >
                                <CheckSquare className="w-3 h-3 text-emerald-600" /> Set Hadir
                            </button>
                            <button
                                onClick={() => handleBulkSet('Alfa')}
                                className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 font-semibold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                            >
                                <XSquare className="w-3 h-3 text-rose-600" /> Set Alfa
                            </button>
                            <button
                                onClick={() => handleBulkSet('Hadir')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-lg border border-slate-200 transition-all"
                                title="Reset Data"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Cari nama lengkap..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* LIST ANGGOTA */}
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="bg-white rounded-xl p-8 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-2 border border-slate-200 shadow-sm">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span>Memuat data anggota...</span>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-xs text-slate-400 font-medium border border-slate-200 shadow-sm">
                            Tidak ada nama anggota di kategori ini.
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-all"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-bold text-xs text-slate-800 truncate">
                                        {member.name}
                                    </h4>

                                    <select
                                        value={attendanceMap[member.id] || 'Hadir'}
                                        onChange={(e) => handleStatusChange(member.id, e.target.value)}
                                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${attendanceMap[member.id] === 'Hadir'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                            : attendanceMap[member.id] === 'Izin'
                                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                                : attendanceMap[member.id] === 'Sakit'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                                                    : 'bg-rose-50 text-rose-700 border-rose-300'
                                            }`}
                                    >
                                        <option value="Hadir">Hadir</option>
                                        <option value="Izin">Izin</option>
                                        <option value="Sakit">Sakit</option>
                                        <option value="Alfa">Alfa</option>
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Catatan / Keterangan (opsional)"
                                    value={notesMap[member.id] || ''}
                                    onChange={(e) => handleNoteChange(member.id, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-[11px] text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* TOMBOL SUBMIT */}
                <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    <span>SIMPAN FINALISASI ABSENSI</span>
                </button>
            </main>

            {/* MODAL KONFIRMASI */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl relative border border-slate-200 text-center space-y-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                            <AlertCircle className="w-5 h-5" />
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-slate-900">Konfirmasi Finalisasi</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Apakah Anda yakin ingin menyimpan data absensi ini?
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1 font-semibold text-slate-700">
                            <div className="flex justify-between">
                                <span>Hadir:</span>
                                <span className="text-emerald-700">{hadirCount} Orang</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Izin:</span>
                                <span className="text-amber-700">{izinCount} Orang</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sakit:</span>
                                <span className="text-blue-700">{sakitCount} Orang</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Alfa:</span>
                                <span className="text-rose-700">{alfaCount} Orang</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-lg transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleFinalizeSubmit}
                                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-all shadow-sm"
                            >
                                Ya, Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}