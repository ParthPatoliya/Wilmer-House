/* eslint-disable */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar as CalendarIcon, Filter, Plus, Search, ChevronLeft, ChevronRight, Download, Users, UserPlus, Check, X, Clock, AlertCircle, List } from 'lucide-react';
import ReservationTab from '@/components/ReservationTab';

export default function ReservationsCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rooms, setRooms] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [guests, setGuests] = useState<any[]>([]);

    // Drag to create state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ room: any, date: Date } | null>(null);
    const [dragEnd, setDragEnd] = useState<{ room: any, date: Date } | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        guestId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomRes, resRes, guestRes] = await Promise.all([
                fetch('/api/rooms'),
                fetch('/api/reservations'),
                fetch('/api/guests')
            ]);

            if (roomRes.ok) setRooms(await roomRes.json());
            if (resRes.ok) setReservations(await resRes.json());
            if (guestRes.ok) setGuests(await guestRes.json());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    // Calendar Generation
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthDays = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
            return {
                dayObj: d,
                dateStr: d.toISOString().split('T')[0],
                dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
                dayNum: d.getDate()
            };
        });
    }, [currentDate, daysInMonth]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const changeYear = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1);
        setCurrentDate(newDate);
    };

    // Auto Nights Calculation
    const getNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        const diffTime = end.getTime() - start.getTime();
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    // Guest auto-fill
    const handleGuestSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const g = guests.find(guest => guest.id === id);
        if (g) {
            setFormData({
                ...formData,
                guestId: String(g.id || ''),
                firstName: String(g.firstName || ''),
                lastName: String(g.lastName || ''),
                email: g.email ? String(g.email) : '',
                phone: g.phone ? String(g.phone) : '',
                address: g.address ? String(g.address) : ''
            });
        } else {
            setFormData({
                ...formData,
                guestId: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    };

    // Mouse events for drag-to-create calendar
    const handleMouseDown = (room: any, date: Date) => {
        setIsDragging(true);
        setDragStart({ room, date });
        setDragEnd({ room, date });
    };

    const handleMouseEnter = (room: any, date: Date) => {
        if (isDragging && dragStart?.room.id === room.id) {
            setDragEnd({ room, date });
        }
    };

    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const startD = dragStart.date < dragEnd.date ? dragStart.date : dragEnd.date;
            let endD = dragStart.date > dragEnd.date ? dragStart.date : dragEnd.date;

            // Add 1 day to end date to represent check-out day conceptually
            endD = new Date(endD);
            endD.setDate(endD.getDate() + 1);

            setFormData(prev => ({
                ...prev,
                roomId: dragStart.room.id,
                checkIn: startD.toISOString().split('T')[0],
                checkOut: endD.toISOString().split('T')[0],
            }));
            setShowModal(true);
        }
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    const handleSaveReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: formData.roomId,
                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,
                    adults: formData.adults,
                    children: formData.children,
                    notes: formData.notes,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    roomQty: 1
                })
            });

            if (res.ok) {
                await fetchData();
                setShowModal(false);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create reservation');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Download Reservation Summary
    const handleDownloadSummary = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Booking ID,Guest Name,Email,Room,Check In,Check Out,Status,Amount\n";
        reservations.forEach(r => {
            const row = [
                r.id,
                `"${r.guest?.firstName} ${r.guest?.lastName}"`,
                r.guest?.email,
                `"${r.room?.number} - ${r.room?.type}"`,
                new Date(r.checkIn).toLocaleDateString(),
                new Date(r.checkOut).toLocaleDateString(),
                r.status,
                `£${r.totalAmount}`
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Wilmer_House_Reservations_${currentDate.toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Rendering Helpers for Grid
    const isDateInDragSelection = (room: any, date: Date) => {
        if (!isDragging || !dragStart || !dragEnd) return false;
        if (dragStart.room.id !== room.id) return false;

        const start = dragStart.date < dragEnd.date ? dragStart.date : dragEnd.date;
        const end = dragStart.date > dragEnd.date ? dragStart.date : dragEnd.date;
        return date >= start && date <= end;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-500 text-white border-emerald-600';
            case 'Checked In': return 'bg-indigo-500 text-white border-indigo-600';
            case 'Pending': return 'bg-amber-400 text-amber-900 border-amber-500';
            case 'Checked Out': return 'bg-slate-400 text-white border-slate-500';
            default: return 'bg-blue-500 text-white border-blue-600';
        }
    };

    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

    return (
        <div className="space-y-6 max-w-[1800px] mx-auto pb-10" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reservation Calendar</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Drag across dates on a room to quickly create a booking.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-inner relative mr-4 border border-slate-200">
                        <button onClick={() => setViewMode('list')} className={`relative px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-lg transition-colors z-10 ${viewMode === 'list' ? 'text-indigo-700 bg-white shadow-sm ring-1 ring-slate-200/50 cursor-default pointer-events-none' : 'text-slate-500 hover:text-slate-700'}`}>
                            <List className="w-4 h-4" /> List
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`relative px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-lg transition-colors z-10 ${viewMode === 'calendar' ? 'text-indigo-700 bg-white shadow-sm ring-1 ring-slate-200/50 cursor-default pointer-events-none' : 'text-slate-500 hover:text-slate-700'}`}>
                            <CalendarIcon className="w-4 h-4" /> Calendar
                        </button>
                    </div>
                    <button onClick={handleDownloadSummary} className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                        <Download className="w-4 h-4 text-slate-400" />
                        Export Data
                    </button>
                    <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)]">
                        <Plus className="w-4 h-4" />
                        New Booking
                    </button>
                </div>
            </div>

            {viewMode === 'list' && (
                <ReservationTab reservations={reservations} fetchData={fetchData} />
            )}

            {viewMode === 'calendar' && (
                <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                            <button onClick={() => changeYear(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors" title="Previous Year">
                                <ChevronLeft className="w-4 h-4" />
                                <ChevronLeft className="w-4 h-4 -ml-3" />
                            </button>
                            <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors" title="Previous Month">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="w-40 text-center font-bold text-slate-800 text-lg tracking-tight select-none">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors" title="Next Month">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <button onClick={() => changeYear(1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors" title="Next Year">
                                <ChevronRight className="w-4 h-4" />
                                <ChevronRight className="w-4 h-4 -ml-3" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Confirmed</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Checked In</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Pending</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[1600px] select-none">
                            {/* Calendar Header */}
                            <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(40px,1fr))] bg-white border-b border-slate-100 sticky top-0 z-10">
                                <div className="px-6 py-4 font-bold text-sm text-slate-500 uppercase tracking-wider sticky left-0 bg-white border-r border-slate-100 flex items-center shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-20">
                                    Rooms
                                </div>
                                <div className="col-span-1 border-b border-slate-100" style={{ gridColumnEnd: `span ${daysInMonth}` }}>
                                    <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(40px, 1fr))` }}>
                                        {monthDays.map(d => {
                                            const isToday = new Date().toISOString().split('T')[0] === d.dateStr;
                                            return (
                                                <div key={d.dateStr} className={`py-2 text-center border-r border-slate-100/50 flex flex-col items-center justify-center transition-colors ${isToday ? 'bg-indigo-50/50' : ''}`}>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${d.dayName === 'S' ? 'text-rose-400' : 'text-slate-400'}`}>{d.dayName}</span>
                                                    <span className={`text-sm font-bold mt-0.5 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-800'}`}>{d.dayNum}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Body (Rooms & Bookings Grid) */}
                            <div className="divide-y divide-slate-100 bg-slate-50/20">
                                {rooms.map(room => (
                                    <div key={room.id} className="grid grid-cols-[200px_repeat(auto-fit,minmax(40px,1fr))] group hover:bg-slate-50 transition-colors">
                                        <div className="px-6 py-4 bg-white sticky left-0 border-r border-slate-100 shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-10 group-hover:bg-slate-50 transition-colors flex flex-col justify-center">
                                            <div className="font-bold text-sm text-slate-900">{room.number}</div>
                                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{room.type}</div>
                                        </div>

                                        <div className="relative col-span-1" style={{ gridColumnEnd: `span ${daysInMonth}` }}>
                                            {/* Background Grid Cells for Dragging */}
                                            <div className="grid h-full absolute inset-0 z-0" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(40px, 1fr))` }}>
                                                {monthDays.map(d => {
                                                    const inSelection = isDateInDragSelection(room, d.dayObj);
                                                    return (
                                                        <div
                                                            key={`bg-${d.dateStr}`}
                                                            className={`border-r border-slate-100/50 h-full transition-colors ${inSelection ? 'bg-indigo-100/80 cursor-grabbing' : 'hover:bg-indigo-50/30 cursor-crosshair'}`}
                                                            onMouseDown={() => handleMouseDown(room, d.dayObj)}
                                                            onMouseEnter={() => handleMouseEnter(room, d.dayObj)}
                                                        />
                                                    );
                                                })}
                                            </div>

                                            {/* Overlay Bookings */}
                                            <div className="relative h-14 py-2 w-full z-10 pointer-events-none">
                                                {reservations.filter(r => r.roomId === room.id).map(res => {
                                                    const inDate = new Date(res.checkIn);
                                                    const outDate = new Date(res.checkOut);

                                                    // Check if reservation intersects this month
                                                    const startOfMonth = monthDays[0].dayObj;
                                                    const endOfMonth = monthDays[daysInMonth - 1].dayObj;

                                                    if (outDate < startOfMonth || inDate > endOfMonth) return null; // Outside viewport

                                                    // Calculate positioning
                                                    let startIdx = monthDays.findIndex(d => d.dateStr === inDate.toISOString().split('T')[0]);
                                                    let endIdx = monthDays.findIndex(d => d.dateStr === outDate.toISOString().split('T')[0]);

                                                    const isStartCut = startIdx === -1 && inDate < startOfMonth;
                                                    const isEndCut = endIdx === -1 && outDate > endOfMonth;

                                                    startIdx = isStartCut ? 0 : startIdx;
                                                    endIdx = isEndCut ? daysInMonth : endIdx; // If end is next month, stretch to end of row

                                                    const lengthObj = Math.max(1, endIdx - startIdx);

                                                    // CSS percentages based on month length
                                                    const leftPct = (startIdx / daysInMonth) * 100;
                                                    const widthPct = (lengthObj / daysInMonth) * 100;

                                                    return (
                                                        <div
                                                            key={res.id}
                                                            className={`absolute top-2 bottom-2 rounded-lg shadow-sm border flex flex-col justify-center px-2.5 overflow-hidden pointer-events-auto cursor-pointer hover:shadow-md hover:brightness-105 transition-all ${getStatusColor(res.status)} ${isStartCut ? 'rounded-l-none border-l-0' : ''} ${isEndCut ? 'rounded-r-none border-r-0' : ''}`}
                                                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                                            onClick={() => {
                                                                alert(`Booking Details:\nGuest: ${res.guest?.firstName} ${res.guest?.lastName}\nCheck In: ${new Date(res.checkIn).toLocaleDateString()}\nCheck Out: ${new Date(res.checkOut).toLocaleDateString()}`);
                                                            }}
                                                        >
                                                            <div className="text-[11px] font-bold leading-tight truncate">{res.guest?.firstName} {res.guest?.lastName?.charAt(0)}.</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Reservation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto w-full h-full">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-3xl overflow-hidden border border-slate-200/50 my-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                    Create New Reservation
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">Easily book a room. Dragged dates are auto-filled!</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveReservation} className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-8">

                                {/* Dates Section */}
                                <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl relative">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Stay Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Check In</label>
                                            <input type="date" required value={formData.checkIn} onChange={e => setFormData({ ...formData, checkIn: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium shadow-sm transition-shadow" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Check Out</label>
                                            <input type="date" required value={formData.checkOut} onChange={e => setFormData({ ...formData, checkOut: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium shadow-sm transition-shadow" />
                                        </div>
                                        <div className="flex flex-col justify-end pb-1.5">
                                            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
                                                <span className="text-xs font-bold tracking-wide uppercase">Total Nights</span>
                                                <span className="text-2xl font-black">{getNights()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Assign Room</label>
                                        <select required value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-bold shadow-sm">
                                            <option value="" disabled>Select a room...</option>
                                            {rooms.map(r => (
                                                <option key={r.id} value={r.id}>{r.number} - {r.type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Adults</label>
                                            <input type="number" min="1" required value={formData.adults} onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-bold text-center shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Children</label>
                                            <input type="number" min="0" required value={formData.children} onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-bold text-center shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Details Auto-Fill Matrix */}
                                <div className="border border-slate-200 rounded-2xl p-5 relative bg-white shadow-sm">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" /> Guest Information
                                    </h3>

                                    <div className="mb-5 bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-start gap-3">
                                        <UserPlus className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <label className="block text-sm font-bold text-amber-900 mb-1">Quick Select Existing Guest</label>
                                            <select
                                                className="w-full bg-white border border-amber-200/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium text-slate-800"
                                                onChange={handleGuestSelect}
                                                value={formData.guestId || ''}
                                            >
                                                <option value="">-- Manual Entry (Create New Guest) --</option>
                                                {guests.map(g => (
                                                    <option key={g.id} value={g.id}>{g.firstName} {g.lastName} ({g.email || g.phone || 'No Contact Info'})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">First Name <span className="text-rose-500">*</span></label>
                                            <input type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value, guestId: '' })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm" placeholder="John" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Last Name <span className="text-rose-500">*</span></label>
                                            <input type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value, guestId: '' })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm" placeholder="Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal text-xs ml-1">(Used for Confirmation & ID Link)</span></label>
                                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value, guestId: '' })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm" placeholder="guest@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value, guestId: '' })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm" placeholder="+44..." />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Special Notes / Requests</label>
                                    <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm resize-none" placeholder="Allergies, late check-in, etc."></textarea>
                                </div>

                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-10">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm">Cancel</button>
                                <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] disabled:opacity-70 flex items-center gap-2">
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Confirm & Reserve
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
