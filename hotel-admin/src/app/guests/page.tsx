'use client';

import { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, User, Mail, Calendar } from 'lucide-react';

const guests = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 123-4567', lastStay: '2023-11-15', totalStays: 4, status: 'Active' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@example.com', phone: '+1 (555) 987-6543', lastStay: '2023-10-22', totalStays: 1, status: 'Active' },
    { id: 3, name: 'Emma Watson', email: 'emma.w@example.com', phone: '+44 7700 900077', lastStay: '2023-12-01', totalStays: 7, status: 'VIP' },
    { id: 4, name: 'David Smith', email: 'd.smith@example.com', phone: '+1 (555) 456-7890', lastStay: '2023-09-08', totalStays: 2, status: 'Inactive' },
];

export default function GuestsPage() {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');

    const handleCreateReservation = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call to send email and save to DB
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1200);
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Guest & Reservations</h1>
                    <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                        Manage your hotel guests, view histories, and handle reservations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Reservation
                    </button>
                </div>
            </div>

            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-zinc-400 text-zinc-700 shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 rounded-lg">
                                <th className="px-6 py-4 font-semibold first:rounded-l-xl">Guest Details</th>
                                <th className="px-6 py-4 font-semibold">Contact Info</th>
                                <th className="px-6 py-4 font-semibold">Stays</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right last:rounded-r-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {guests.map((guest, i) => (
                                <tr key={guest.id} className="border-b border-zinc-100/50 last:border-0 hover:bg-zinc-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                {guest.name.charAt(0)}
                                            </div>
                                            <div className="font-semibold text-zinc-900">{guest.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                                                <Mail className="w-3.5 h-3.5" /> {guest.email}
                                            </div>
                                            <div className="text-zinc-500 text-xs">{guest.phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-zinc-900">{guest.totalStays} Stays</div>
                                            <div className="text-zinc-500 text-xs flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Last: {guest.lastStay}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${guest.status === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' : guest.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                                            {guest.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-700">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                    The guest details have been saved, and an email confirmation was sent automatically to <span className="text-zinc-900 font-bold">{guestEmail}</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setShowModal(false);
                                    }}
                                    className="mt-8 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md py-3"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateReservation}>
                                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Check In</label>
                                            <input type="date" required className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Check Out</label>
                                            <input type="date" required className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name</label>
                                            <input type="text" required placeholder="John" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name</label>
                                            <input type="text" required placeholder="Doe" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
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
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="guest@example.com"
                                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Contact Number</label>
                                            <input type="tel" required placeholder="+1 (555) 000-0000" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Room Type</label>
                                            <select required className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm font-medium">
                                                <option>Standard Room</option>
                                                <option>Deluxe Suite</option>
                                                <option>Penthouse</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Full Address</label>
                                        <input type="text" required placeholder="123 Main St, Appt 4B, New York, NY 10001" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
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
                                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
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
        </div>
    );
}
