'use client';

import { Clock, CalendarDays, Download, Play, Square, History, Plus, X, Edit, List } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RotaPage() {
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [duration, setDuration] = useState('00:00:00');

    const [shifts, setShifts] = useState<any[]>([]);
    const [timeLogs, setTimeLogs] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [activeStaffId, setActiveStaffId] = useState<string>('');

    const [showModal, setShowModal] = useState(false);
    const [showManualLogModal, setShowManualLogModal] = useState(false);
    const [viewMode, setViewMode] = useState<'shifts' | 'logs'>('shifts');

    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        breakStartTime: '',
        breakEndTime: '',
        breakMinutes: '30',
        status: 'Scheduled'
    });

    const [manualLog, setManualLog] = useState({
        employeeId: '',
        clockInDate: new Date().toISOString().split('T')[0],
        clockInTime: '09:00',
        clockOutDate: new Date().toISOString().split('T')[0],
        clockOutTime: '17:00',
        notes: ''
    });

    useEffect(() => {
        fetchStaff();
        fetchShifts();
        fetchTimeLogs();
    }, []);

    useEffect(() => {
        if (activeStaffId) {
            checkActiveSession(activeStaffId);
        }
    }, [activeStaffId]);

    const fetchShifts = async () => {
        const res = await fetch('/api/rota');
        if (res.ok) setShifts(await res.json());
    };

    const fetchTimeLogs = async () => {
        const res = await fetch('/api/timelogs');
        if (res.ok) setTimeLogs(await res.json());
    };

    const fetchStaff = async () => {
        const res = await fetch('/api/staff');
        if (res.ok) {
            const data = await res.json();
            setStaff(data);
            if (data.length > 0) {
                setFormData(f => ({ ...f, employeeId: data[0].id }));
                setManualLog(m => ({ ...m, employeeId: data[0].id }));
                setActiveStaffId(data[0].id);
            }
        }
    };

    const checkActiveSession = async (id: string) => {
        setIsClockedIn(false);
        setClockInTime(null);
        setDuration('00:00:00');

        const res = await fetch(`/api/timelogs/active?employeeId=${id}`);
        if (res.ok) {
            const data = await res.json();
            if (data && !data.none && data.clockIn) {
                setIsClockedIn(true);
                setClockInTime(new Date(data.clockIn));
            }
        }
    };

    const handleClockToggle = async () => {
        if (!activeStaffId) {
            alert('Please select a staff member first');
            return;
        }

        if (!isClockedIn) {
            // Clock In
            const res = await fetch('/api/timelogs/active', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: activeStaffId })
            });

            if (res.ok) {
                const data = await res.json();
                setIsClockedIn(true);
                setClockInTime(new Date(data.clockIn));
                fetchTimeLogs();
            }
        } else {
            // Clock Out
            const res = await fetch('/api/timelogs/active', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: activeStaffId })
            });

            if (res.ok) {
                setIsClockedIn(false);
                setClockInTime(null);
                setDuration('00:00:00');
                fetchTimeLogs();
            }
        }
    };

    const handleSaveShift = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const payload = editingId ? { ...formData, id: editingId } : formData;

        const res = await fetch('/api/rota', {
            method,
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            setShowModal(false);
            setEditingId(null);
            fetchShifts();
        } else {
            alert('Failed to save shift.');
        }
    };

    const handleSaveManualLog = async (e: React.FormEvent) => {
        e.preventDefault();

        const inDateTime = new Date(`${manualLog.clockInDate}T${manualLog.clockInTime}`);
        const outDateTime = new Date(`${manualLog.clockOutDate}T${manualLog.clockOutTime}`);

        const res = await fetch('/api/timelogs', {
            method: 'POST',
            body: JSON.stringify({
                employeeId: manualLog.employeeId,
                clockIn: inDateTime.toISOString(),
                clockOut: outDateTime.toISOString(),
                notes: manualLog.notes
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            setShowManualLogModal(false);
            fetchTimeLogs();
        } else {
            alert('Failed to save manual timesheet.');
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isClockedIn && clockInTime) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - clockInTime.getTime();
                const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
                const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
                setDuration(`${h}:${m}:${s}`);
            }, 1000);
        } else {
            setDuration('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isClockedIn, clockInTime]);

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Rota & Timesheet</h1>
                    <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                        Manage your working hours, start/end session clock-ins, and export reports.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => setShowManualLogModal(true)} className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                        <History className="w-4 h-4" /> Add Past Timesheet
                    </button>
                    <button onClick={() => { setEditingId(null); setShowModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Shift (Rota)
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Clock In / Out Widget */}
                <div className="col-span-1 border border-zinc-200/60 bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Current Session</h3>

                    <div className="w-full mb-6">
                        <select
                            value={activeStaffId}
                            onChange={(e) => setActiveStaffId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium text-center"
                        >
                            <option value="">Select Staff Member...</option>
                            {staff.map(st => (
                                <option key={st.id} value={st.id}>{st.firstName} {st.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-5xl font-black tabular-nums text-zinc-900 tracking-tight mb-8">
                        {duration}
                    </div>

                    <button
                        onClick={handleClockToggle}
                        className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-offset-4 active:scale-95 ${isClockedIn ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500/50 shadow-rose-500/30' : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500/50 shadow-emerald-500/30'}`}
                    >
                        {isClockedIn ? (
                            <><Square className="w-8 h-8 fill-current" /> END SHIFT</>
                        ) : (
                            <><Play className="w-8 h-8 fill-current" /> START SHIFT</>
                        )}
                    </button>
                    {isClockedIn && clockInTime && (
                        <p className="text-xs font-bold text-zinc-500 mt-6 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-200">
                            Session Started: {clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200/60 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex bg-zinc-200/50 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('shifts')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'shifts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                                >
                                    Rota Schedule
                                </button>
                                <button
                                    onClick={() => setViewMode('logs')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                                >
                                    Timesheets
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto p-4 max-h-[450px] overflow-y-auto">
                            <div className="space-y-3">
                                {viewMode === 'shifts' ? (
                                    shifts.length === 0 ? <p className="text-zinc-500 text-sm p-4 text-center">No upcoming shifts scheduled.</p> :
                                        shifts.map((s, i) => (
                                            <div key={i} className="border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm hover:border-indigo-200 transition-colors">
                                                <div>
                                                    <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                                        {s.employee?.firstName} {s.employee?.lastName}
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700' : s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>{s.status}</span>
                                                    </h4>
                                                    <p className="text-xs font-bold text-zinc-500 uppercase mt-1">
                                                        {new Date(s.date).toLocaleDateString('en-GB')} • {s.employee?.role}
                                                    </p>
                                                </div>
                                                <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 flex gap-6 items-center w-full sm:w-auto">
                                                    <div>
                                                        <span className="text-sm font-bold text-indigo-600">{s.startTime} - {s.endTime}</span>
                                                        {(s.breakStartTime && s.breakEndTime) ? (
                                                            <p className="text-xs text-zinc-500 font-medium pb-1.5 border-b border-zinc-100">Break: {s.breakStartTime} - {s.breakEndTime}</p>
                                                        ) : null}
                                                        <p className="text-xs text-zinc-500 font-medium mt-1">{s.breakMinutes}m break</p>
                                                    </div>
                                                    <button onClick={() => {
                                                        setFormData({
                                                            employeeId: s.employeeId,
                                                            date: s.date.split('T')[0],
                                                            startTime: s.startTime,
                                                            endTime: s.endTime,
                                                            breakStartTime: s.breakStartTime || '',
                                                            breakEndTime: s.breakEndTime || '',
                                                            breakMinutes: s.breakMinutes.toString(),
                                                            status: s.status
                                                        });
                                                        setEditingId(s.id);
                                                        setShowModal(true);
                                                    }} className="p-2 ml-auto hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-indigo-600 transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    timeLogs.length === 0 ? <p className="text-zinc-500 text-sm p-4 text-center">No timesheets logged yet.</p> :
                                        timeLogs.map((log, i) => {
                                            const inDate = new Date(log.clockIn);
                                            const outDate = log.clockOut ? new Date(log.clockOut) : null;
                                            return (
                                                <div key={i} className={`border rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm transition-colors ${log.status === 'Active' ? 'border-amber-200 bg-amber-50/30' : 'border-zinc-200 bg-white'}`}>
                                                    <div>
                                                        <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                                            {log.employee?.firstName} {log.employee?.lastName}
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${log.status === 'Active' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-700'}`}>{log.status === 'Active' ? 'Currently Working' : 'Completed Session'}</span>
                                                        </h4>
                                                        <p className="text-xs font-bold text-zinc-500 uppercase mt-1">
                                                            Logged on {inDate.toLocaleDateString('en-GB')}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 flex gap-6 items-center w-full sm:w-auto">
                                                        <div className="text-right">
                                                            <span className="text-sm font-bold text-zinc-700">
                                                                {inDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                {' -> '}
                                                                {outDate ? outDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                            </span>
                                                            {log.notes && (
                                                                <p className="text-xs text-zinc-500 font-medium mt-1 truncate max-w-[150px]">Note: {log.notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Timesheet Modal */}
            {showManualLogModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden border border-zinc-200/50 my-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">Add Past Timesheet</h2>
                            <button onClick={() => setShowManualLogModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1 hover:bg-zinc-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveManualLog}>
                            <div className="p-6 space-y-5">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-800 text-sm font-medium">
                                    Use this form to manually log a past shift if a staff member forgot to clock in or out.
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Staff Member</label>
                                    <select required value={manualLog.employeeId} onChange={e => setManualLog({ ...manualLog, employeeId: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium">
                                        <option value="" disabled>Select Staff</option>
                                        {staff.map(st => (
                                            <option key={st.id} value={st.id}>{st.firstName} {st.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Clock In Date</label>
                                        <input type="date" required value={manualLog.clockInDate} onChange={e => setManualLog({ ...manualLog, clockInDate: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Clock In Time</label>
                                        <input type="time" required value={manualLog.clockInTime} onChange={e => setManualLog({ ...manualLog, clockInTime: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 shadow-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Clock Out Date</label>
                                        <input type="date" required value={manualLog.clockOutDate} onChange={e => setManualLog({ ...manualLog, clockOutDate: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Clock Out Time</label>
                                        <input type="time" required value={manualLog.clockOutTime} onChange={e => setManualLog({ ...manualLog, clockOutTime: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Reason / Notes</label>
                                    <input type="text" required placeholder="Forgot to clock out" value={manualLog.notes} onChange={e => setManualLog({ ...manualLog, notes: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 shadow-sm" />
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 rounded-b-3xl">
                                <button type="button" onClick={() => setShowManualLogModal(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md">Save Manual Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rota Shift Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden border border-zinc-200/50 my-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">{editingId ? 'Edit Scheduled Shift' : 'Add New Scheduled Shift'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1 hover:bg-zinc-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveShift}>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Staff Member</label>
                                    <select required value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium">
                                        <option value="" disabled>Select Staff</option>
                                        {staff.map(st => (
                                            <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Date</label>
                                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Start Time</label>
                                        <input type="time" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">End Time</label>
                                        <input type="time" required value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Status</label>
                                        <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium">
                                            <option>Scheduled</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 rounded-b-3xl">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md">Save Shift Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
