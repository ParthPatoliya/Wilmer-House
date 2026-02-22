/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, User, Mail, Calendar } from 'lucide-react';

export default function GuestsPage() {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reservation Form data
    const [resForm, setResForm] = useState({
        checkIn: '', checkOut: '', firstName: '', lastName: '', email: '', phone: '', address: '', roomType: 'Standard Room', roomId: '', status: 'Confirmed', adults: 1, children: 0
    });

    // Calendar Drag Selection
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ room: any, offset: number } | null>(null);
    const [dragEnd, setDragEnd] = useState<{ room: any, offset: number } | null>(null);

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockForm, setBlockForm] = useState({ checkIn: '', checkOut: '', roomId: '', notes: '' });

    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [editingGuest, setEditingGuest] = useState<any>(null);

    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [startMonth, setStartMonth] = useState(new Date().getMonth());

    const [roomsForCalendar, setRoomsForCalendar] = useState<any[]>([]);
    const [guests, setGuests] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [startYear, startMonth]);

    const fetchData = async () => {
        try {
            // Fetch reservations and format them for the calendar
            const rRes = await fetch('/api/reservations');
            if (rRes.ok) {
                const reservations = await rRes.json();

                // Fetch rooms to organize the calendar rows
                const roomRes = await fetch('/api/rooms');
                if (roomRes.ok) {
                    const roomsData = await roomRes.json();

                    const calendarRooms = roomsData.map((room: any) => {
                        const roomBookings = reservations.filter((r: any) => r.roomId === room.id && r.status !== 'Cancelled').map((r: any) => {
                            const ci = new Date(r.checkIn);
                            const co = new Date(r.checkOut);
                            const refDate = new Date(startYear, startMonth, 1);
                            const startOffset = Math.floor((ci.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
                            const length = Math.floor((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));

                            return {
                                id: r.id,
                                startOffset: startOffset < 0 ? 0 : startOffset,
                                length: startOffset < 0 ? length + startOffset : length, // Crop visually if overlaps past start
                                status: r.status,
                                guest: `${r.guest.firstName} ${r.guest.lastName}`,
                                email: r.guest.email,
                                paymentStatus: r.paymentStatus,
                                notes: r.notes
                            };
                        }).filter((b: any) => b.startOffset < daysInMonth && b.startOffset + b.length > 0); // Only within the month window

                        return { id: room.id, name: `${room.type} ${room.number}`, bookings: roomBookings };
                    });

                    setRoomsForCalendar(calendarRooms);
                }
            }
            const gRes = await fetch('/api/guests');
            if (gRes.ok) {
                setGuests(await gRes.json());
            }
        } catch (e) { }
    };

    const daysInMonth = new Date(startYear, startMonth + 1, 0).getDate();

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(startYear, startMonth, 1);
        d.setDate(d.getDate() + i);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: d.toISOString().split('T')[0]
        };
    });

    const handleMouseDown = (room: any, offset: number) => {
        setIsDragging(true);
        setDragStart({ room, offset });
        setDragEnd({ room, offset });
    };

    const handleMouseEnter = (room: any, offset: number) => {
        if (isDragging && dragStart && dragStart.room.id === room.id) {
            setDragEnd({ room, offset });
        }
    };

    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const startOffset = Math.min(dragStart.offset, dragEnd.offset);
            const endOffset = Math.max(dragStart.offset, dragEnd.offset) + 1; // Check out is the next day

            const checkInDate = new Date(startYear, startMonth, startOffset + 1).toISOString().split('T')[0];
            const checkOutDate = new Date(startYear, startMonth, endOffset + 1).toISOString().split('T')[0];

            setResForm(prev => ({
                ...prev,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                roomId: dragStart.room.id,
                roomType: dragStart.room.type
            }));
            setShowModal(true);
        }
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    const handleCreateReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await fetch('/api/reservations', {
            method: 'POST', body: JSON.stringify({ ...resForm }), headers: { 'Content-Type': 'application/json' }
        });
        setIsLoading(false);
        if (res.ok) {
            setIsSuccess(true);
            fetchData();
        } else {
            alert('Failed to save reservation.');
        }
    };

    const handleCreateBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await fetch('/api/reservations', {
            method: 'POST', body: JSON.stringify({ ...blockForm, isBlock: true }), headers: { 'Content-Type': 'application/json' }
        });
        setIsLoading(false);
        if (res.ok) {
            setShowBlockModal(false);
            setBlockForm({ checkIn: '', checkOut: '', roomId: '', notes: '' });
            fetchData();
        } else alert('Failed to block room.');
    };

    const handleUpdateBookingStatus = async () => {
        if (!selectedBooking) return;
        const res = await fetch('/api/reservations', {
            method: 'PUT',
            body: JSON.stringify({ id: selectedBooking.id, status: selectedBooking.status, paymentStatus: selectedBooking.paymentStatus }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setSelectedBooking(null);
            fetchData();
        } else alert('Update failed');
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;
        if (!confirm('Are you sure you want to cancel this booking? This will free up the room.')) return;

        const res = await fetch('/api/reservations', {
            method: 'PUT',
            body: JSON.stringify({ id: selectedBooking.id, status: 'Cancelled', paymentStatus: selectedBooking.paymentStatus }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setSelectedBooking(null);
            fetchData();
        } else alert('Cancellation failed');
    };

    const handleDeleteBlock = async () => {
        if (!selectedBooking) return;
        if (!confirm('Are you sure you want to delete this system block?')) return;

        const res = await fetch(`/api/reservations?id=${selectedBooking.id}`, { method: 'DELETE' });
        if (res.ok) {
            setSelectedBooking(null);
            fetchData();
        } else alert('Deletion failed');
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Booking Calendar</h1>
                    <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                        Manage your hotel reservations and room blockers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowBlockModal(true)} className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
                        System Block
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Reservation
                    </button>
                </div>
            </div>

            {/* Calendar View Container */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2"><Calendar className="w-5 h-5" /> Booking Calendar</h2>
                    <div className="flex gap-2">
                        <select
                            value={startMonth}
                            onChange={e => setStartMonth(parseInt(e.target.value))}
                            className="bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={startYear}
                            onChange={e => setStartYear(parseInt(e.target.value))}
                            className="bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto p-4">
                    <div className="min-w-[1200px]">
                        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `150px repeat(${daysInMonth}, minmax(40px, 1fr))` }}>
                            <div className="font-bold text-sm text-zinc-500 self-end pb-2 sticky left-0 bg-white">Room</div>
                            {calendarDays.map(d => (
                                <div key={d.date} className="text-center font-bold text-sm text-zinc-700 bg-zinc-50 rounded-lg py-2">
                                    <div className="text-xs text-zinc-400 font-medium">{d.day}</div>
                                    {d.date}
                                </div>
                            ))}
                        </div>
                        <div onMouseUp={handleMouseUp} onMouseLeave={() => { if (isDragging) handleMouseUp(); }}>
                            {roomsForCalendar.map(room => (
                                <div key={room.name} className="grid gap-2 mb-2 items-center group relative select-none" style={{ gridTemplateColumns: `150px repeat(${daysInMonth}, minmax(40px, 1fr))` }}>
                                    <div className="font-bold text-sm text-zinc-800 sticky left-0 bg-white shadow-sm pr-2">{room.name}</div>
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const booking = room.bookings.find((b: any) => b.startOffset === i);
                                        if (booking) {
                                            return (
                                                <div key={i} onClick={(e) => { e.stopPropagation(); setSelectedBooking({ ...booking, room: room.name }); }} style={{ gridColumn: `span ${booking.length}` }} className={`relative h-10 rounded-xl px-3 flex items-center text-[10px] md:text-xs font-bold text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity truncate shrink-0 ${booking.status === 'Confirmed' ? 'bg-emerald-500' : booking.status === 'VIP' ? 'bg-indigo-500' : booking.status === 'Blocked' ? 'bg-rose-900 border-2 border-dashed border-rose-300' : 'bg-amber-500'}`}>
                                                    {booking.status === 'Blocked' ? 'MAINTENANCE (BLOCKED)' : booking.guest}
                                                </div>
                                            );
                                        }
                                        const isCovered = room.bookings.some((b: any) => i >= b.startOffset && i < b.startOffset + b.length);
                                        if (isCovered) return null;

                                        const isSelectedCell = dragStart && dragEnd && dragStart.room.id === room.id && i >= Math.min(dragStart.offset, dragEnd.offset) && i <= Math.max(dragStart.offset, dragEnd.offset);

                                        return (
                                            <div
                                                key={i}
                                                onMouseDown={() => handleMouseDown(room, i)}
                                                onMouseEnter={() => handleMouseEnter(room, i)}
                                                className={`h-10 border border-dashed border-zinc-200 rounded-xl cursor-crosshair transition-colors flex items-center justify-center ${isSelectedCell ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-zinc-50 hover:border-indigo-300 group-hover:border-zinc-300'}`}
                                            >
                                                {!isSelectedCell && <Plus className="w-4 h-4 text-indigo-400 opacity-0 hover:opacity-100" />}
                                                {isSelectedCell && <div className="w-full h-full bg-indigo-500/20 rounded-xl"></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Creating Reservation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden border border-zinc-200/50 my-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">Create Reservation</h2>
                            <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 hover:bg-zinc-100 rounded-lg focus:outline-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Reservation Confirmed!</h3>
                                <p className="text-zinc-500 font-medium max-w-sm">
                                    The guest details have been saved, and an email confirmation was sent automatically to <span className="text-zinc-900 font-bold">{resForm.email}</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setShowModal(false);
                                        setResForm({ checkIn: '', checkOut: '', firstName: '', lastName: '', email: '', phone: '', address: '', roomType: 'Standard Room', roomId: '', status: 'Confirmed', adults: 1, children: 0 });
                                    }}
                                    className="mt-8 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md py-3"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateReservation}>
                                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">

                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-2">
                                        <label className="block text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                            <Search className="w-4 h-4 text-indigo-500" /> Search Existing Guest
                                        </label>
                                        <select
                                            className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    const g = guests.find(g => g.id === e.target.value);
                                                    if (g) setResForm({ ...resForm, firstName: g.firstName, lastName: g.lastName, email: g.email, phone: g.phone || '', address: g.address || '' });
                                                } else {
                                                    setResForm({ ...resForm, firstName: '', lastName: '', email: '', phone: '', address: '' });
                                                }
                                            }}
                                        >
                                            <option value="">Select a previous guest to auto-fill details... (Optional)</option>
                                            {guests.map((g: any) => (
                                                <option key={g.id} value={g.id}>{g.firstName} {g.lastName} - {g.email}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Check In</label>
                                            <input type="date" required value={resForm.checkIn} onChange={(e) => setResForm({ ...resForm, checkIn: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5 flex justify-between items-center">
                                                <span>Check Out</span>
                                                {resForm.checkIn && resForm.checkOut && new Date(resForm.checkOut) > new Date(resForm.checkIn) && (
                                                    <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                        {Math.ceil((new Date(resForm.checkOut).getTime() - new Date(resForm.checkIn).getTime()) / (1000 * 3600 * 24))} Nights
                                                    </span>
                                                )}
                                            </label>
                                            <input type="date" required value={resForm.checkOut} onChange={(e) => setResForm({ ...resForm, checkOut: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Adults</label>
                                            <input type="number" min="1" required value={resForm.adults} onChange={(e) => setResForm({ ...resForm, adults: parseInt(e.target.value) })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Children</label>
                                            <input type="number" min="0" required value={resForm.children} onChange={(e) => setResForm({ ...resForm, children: parseInt(e.target.value) })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name</label>
                                            <input type="text" required value={resForm.firstName} onChange={(e) => setResForm({ ...resForm, firstName: e.target.value })} placeholder="John" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name</label>
                                            <input type="text" required value={resForm.lastName} onChange={(e) => setResForm({ ...resForm, lastName: e.target.value })} placeholder="Doe" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-zinc-700">Email Address</label>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Auto-Send Enabled</span>
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={resForm.email}
                                            onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                                            placeholder="guest@example.com"
                                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Contact Number</label>
                                            <input type="tel" required value={resForm.phone} onChange={(e) => setResForm({ ...resForm, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Room Type</label>
                                            <select required value={resForm.roomType} onChange={(e) => setResForm({ ...resForm, roomType: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm font-medium">
                                                <option>Standard Room</option>
                                                <option>Deluxe Suite</option>
                                                <option>Penthouse</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Full Address</label>
                                            <input type="text" required value={resForm.address} onChange={(e) => setResForm({ ...resForm, address: e.target.value })} placeholder="123 Main St, Appt 4B, New York, NY 10001" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Booking Status</label>
                                            <select required value={resForm.status} onChange={(e) => setResForm({ ...resForm, status: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-zinc-300 transition-colors">
                                                <option>Confirmed</option>
                                                <option>Pending</option>
                                                <option>Blocked</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50 border border-indigo-100/50 rounded-xl p-4 flex gap-3 items-start">
                                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900">ID Verification via Email</p>
                                            <p className="text-xs text-indigo-700/80 font-medium mt-0.5">The guest will receive a secure link in their confirmation email to securely upload their ID verifying their identity.</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 rounded-b-3xl">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                                    <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2">
                                        {isLoading ? 'Processing...' : 'Confirm Book & Email'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for Booking Details Status Updating */}
            {selectedBooking && selectedBooking.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden border border-zinc-200/50 my-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">Edit Details</h2>
                            <button onClick={() => setSelectedBooking(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 hover:bg-zinc-100 rounded-lg focus:outline-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">{selectedBooking.guest}</h3>
                                <p className="text-sm text-zinc-500 font-medium">{selectedBooking.room} {selectedBooking.status !== 'Blocked' && `• ${selectedBooking.email}`}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-y border-zinc-100 py-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Booking Status</label>
                                    <select value={selectedBooking.status} onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium">
                                        <option>Confirmed</option>
                                        <option>Pending</option>
                                        <option>Checked In</option>
                                        <option>Checked Out</option>
                                        <option>Cancelled</option>
                                        <option>Blocked</option>
                                    </select>
                                </div>
                                {selectedBooking.status !== 'Blocked' && (
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Payment Status</label>
                                        <select value={selectedBooking.paymentStatus} onChange={(e) => setSelectedBooking({ ...selectedBooking, paymentStatus: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm font-medium">
                                            <option>Pending</option>
                                            <option>Paid - Card</option>
                                            <option>Paid - Cash</option>
                                            <option>Paid - Bank Transfer</option>
                                            <option>Refunded</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {selectedBooking.status === 'Blocked' && (
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Blocking Reason / Notes</label>
                                    <textarea
                                        readOnly
                                        value={selectedBooking.notes || 'No reason provided.'}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-700 focus:outline-none shadow-sm min-h-[80px]"
                                    ></textarea>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3 rounded-b-3xl">
                            {selectedBooking.status === 'Blocked' ? (
                                <button onClick={handleDeleteBlock} className="px-5 py-2.5 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all">Delete Block</button>
                            ) : (
                                <button onClick={handleCancelBooking} className="px-5 py-2.5 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all">Cancel Booking</button>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedBooking(null)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Close</button>
                                <button onClick={handleUpdateBookingStatus} className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md">Save Changes to Database</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Blocking Room natively */}
            {showBlockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden border border-rose-200/50 my-8">
                        <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
                            <h2 className="text-xl font-bold text-rose-900">Block Room for Maintenance</h2>
                            <button onClick={() => setShowBlockModal(false)} className="text-rose-400 hover:text-rose-700 transition-colors p-1 hover:bg-rose-100 rounded-lg focus:outline-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateBlock}>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Block Start</label>
                                        <input type="date" required value={blockForm.checkIn} onChange={(e) => setBlockForm({ ...blockForm, checkIn: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5 flex justify-between items-center">
                                            <span>Block End</span>
                                            {blockForm.checkIn && blockForm.checkOut && new Date(blockForm.checkOut) > new Date(blockForm.checkIn) && (
                                                <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                                                    {Math.ceil((new Date(blockForm.checkOut).getTime() - new Date(blockForm.checkIn).getTime()) / (1000 * 3600 * 24))} Days
                                                </span>
                                            )}
                                        </label>
                                        <input type="date" required value={blockForm.checkOut} onChange={(e) => setBlockForm({ ...blockForm, checkOut: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Select Room to Pull Offline</label>
                                    <select required value={blockForm.roomId} onChange={(e) => setBlockForm({ ...blockForm, roomId: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm font-medium">
                                        <option value="" disabled>Choose a Room...</option>
                                        {roomsForCalendar.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Reason / Notes</label>
                                    <textarea
                                        value={blockForm.notes}
                                        onChange={(e) => setBlockForm({ ...blockForm, notes: e.target.value })}
                                        placeholder="e.g. Plumber scheduled to fix leaky sink"
                                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm min-h-[80px]"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 rounded-b-3xl">
                                <button type="button" onClick={() => setShowBlockModal(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-70 flex items-center gap-2">
                                    {isLoading ? 'Processing...' : 'Confirm System Block'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
