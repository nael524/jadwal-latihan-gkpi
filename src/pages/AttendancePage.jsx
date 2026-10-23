import React, { useState, useEffect } from 'react';
import logo from '../assets/LOGO GKPI.png';
import { supabase } from '../supabaseClient';
import {
    UserCheck,
    CheckCircle,
    Search,
    CheckSquare,
    XSquare,
    RotateCcw,
    Send,
    ArrowLeft,
    Calendar,
    AlertTriangle,
    Loader2,
    Filter
} from 'lucide-react';

export default function AttendancePage({ scheduleData, onBack }) {
    const [selectedScheduleId, setSelectedScheduleId] = useState(
        scheduleData && scheduleData.length > 0 ? scheduleData[0].id : 1
    );
    const [members, setMembers] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [notesMap, setNotesMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const { data: memberList, error: mErr } = await supabase
                    .from('members')
                    .select('*')
                    .order('name', { ascending: true });

                if (mErr) throw mErr;
                setMembers(memberList || []);

                const { data: attDetails } = await supabase
                    .from('attendance_details')
                    .select('member_id, status, notes')
                    .eq('schedule_id', selectedScheduleId);

                const newMap = {};
                const newNotes = {};

                (memberList || []).forEach((m) => {
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
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedScheduleId]);

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
            const selectedObj = scheduleData.find((s) => s.id === selectedScheduleId);
            const { data: sessionData, error: sErr } = await supabase
                .from('attendance_sessions')
                .upsert(
                    [
                        {
                            schedule_id: selectedScheduleId,
                            title: `Absensi ${selectedObj?.activity || 'Latihan'}`,
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

            setSuccessMessage('Finalisasi Absensi Berhasil Disimpan ke Supabase!');
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            alert('Gagal submit absensi: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMembers = members.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = filterRole === 'ALL' || m.role.toLowerCase().includes(filterRole.toLowerCase());
        return matchSearch && matchRole;
    });

    const selectedScheduleObj = scheduleData.find((s) => s.id === selectedScheduleId);

    return (
        <div
            className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-20 relative"
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            {/* HEADER PAGE ABSENSI */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm border border-slate-100">
                            <img src={logo} alt="Logo GKPI" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-right">
                            <h1 className="text-xs font-extrabold text-slate-900 uppercase">
                                PRESENSI ANGGOTA
                            </h1>
                            <p className="text-[10px] font-semibold text-blue-600">
                                GKPI Immanuel
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* KONTEN UTAMA */}
            <main className="max-w-md mx-auto px-4 pt-4 w-full flex-1 space-y-4">
                {/* DROPDOWN PILIH JADWAL LATIHAN */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2">
                    <label className="block text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Pilih Jadwal Latihan:
                    </label>
                    <select
                        value={selectedScheduleId}
                        onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600"
                    >
                        {scheduleData.map((s) => (
                            <option key={s.id} value={s.id}>
                                [{s.day}] {s.date} — {s.activity}
                            </option>
                        ))}
                    </select>

                    {selectedScheduleObj && (
                        <div className="text-[11px] text-slate-600 font-medium bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 flex items-center justify-between">
                            <span>Waktu: <strong>{selectedScheduleObj.time}</strong></span>
                            <span>Lokasi: <strong>{selectedScheduleObj.location}</strong></span>
                        </div>
                    )}
                </div>

                {/* RINGKASAN REKAP STATISTIK */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-2xl">
                        <span className="block text-[10px] text-emerald-600 uppercase">HADIR</span>
                        <span className="text-base font-black">{hadirCount}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-2xl">
                        <span className="block text-[10px] text-amber-600 uppercase">IZIN</span>
                        <span className="text-base font-black">{izinCount}</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-2.5 rounded-2xl">
                        <span className="block text-[10px] text-blue-600 uppercase">SAKIT</span>
                        <span className="text-base font-black">{sakitCount}</span>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-2xl">
                        <span className="block text-[10px] text-rose-600 uppercase">ALFA</span>
                        <span className="text-base font-black">{alfaCount}</span>
                    </div>
                </div>

                {/* CONTROLLER & PENCARIAN ANGGOTA */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Akses Cepat:
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => handleBulkSet('Hadir')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                            >
                                <CheckSquare className="w-3 h-3" /> Hadir All
                            </button>
                            <button
                                onClick={() => handleBulkSet('Alfa')}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                            >
                                <XSquare className="w-3 h-3" /> Alfa All
                            </button>
                            <button
                                onClick={() => handleBulkSet('Hadir')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] p-1.5 rounded-xl"
                                title="Reset ke Hadir"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Cari nama pemuda/i..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none"
                        >
                            <option value="ALL">Semua</option>
                            <option value="MC">MC</option>
                            <option value="Prosesi">Prosesi</option>
                            <option value="Penciptaan">Penciptaan</option>
                            <option value="Fragmen">Fragmen</option>
                            <option value="Panitia">Panitia</option>
                        </select>
                    </div>
                </div>

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* DAFTAR LIST ANGGOTA */}
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="bg-white rounded-2xl p-8 text-center text-xs font-bold text-slate-400 flex flex-col items-center gap-2 border border-slate-200/90 shadow-sm">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <span>Memuat anggota dari Supabase...</span>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 font-medium border border-slate-200/90 shadow-sm">
                            Nama tidak ditemukan.
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm space-y-2 transition-all hover:border-blue-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-900">{member.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                                    </div>

                                    <select
                                        value={attendanceMap[member.id] || 'Hadir'}
                                        onChange={(e) => handleStatusChange(member.id, e.target.value)}
                                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${attendanceMap[member.id] === 'Hadir'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : attendanceMap[member.id] === 'Izin'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : attendanceMap[member.id] === 'Sakit'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200'
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
                                    placeholder="Keterangan / Catatan izin (opsional)..."
                                    value={notesMap[member.id] || ''}
                                    onChange={(e) => handleNoteChange(member.id, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600 rounded-xl px-3 py-1.5 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* TOMBOL FINALISASI */}
                <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    <span>FINALISASI ABSENSI KE SUPABASE</span>
                </button>
            </main>

            {/* MODAL KONFIRMASI FINALISASI */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative border border-slate-100 text-center space-y-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="font-extrabold text-base text-slate-900">Konfirmasi Finalisasi</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Simpan rekap absensi ini secara permanen ke database?
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-left space-y-1 font-semibold text-slate-700">
                            <p className="text-emerald-700">✓ Hadir: {hadirCount} Orang</p>
                            <p className="text-amber-700">✍ Izin: {izinCount} Orang</p>
                            <p className="text-blue-700">🏥 Sakit: {sakitCount} Orang</p>
                            <p className="text-rose-700">✕ Alfa: {alfaCount} Orang</p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleFinalizeSubmit}
                                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
                            >
                                Ya, Submit!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}