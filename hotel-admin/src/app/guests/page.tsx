/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Mail, MapPin, Phone, User, Trash2, Edit } from 'lucide-react';

export default function GuestsPage() {
    const [guests, setGuests] = useState<{ [key: string]: string | number | boolean }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingGuest, setEditingGuest] = useState<{ [key: string]: string | number | boolean } | null>(null);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        vipStatus: 'Active'
    });

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const res = await fetch('/api/guests');
            if (res.ok) {
                const data = await res.json();
                setGuests(data);
            }
        } catch (error) {
            console.error("Failed to fetch guests", error);
        }
    };

    const handleSaveGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const url = '/api/guests';
            const method = editingGuest ? 'PUT' : 'POST';
            const body = editingGuest ? { ...formData, id: editingGuest.id } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save guest. Duplicate email or phone might exist.');
                setIsLoading(false);
                return;
            }

            await fetchGuests();
            closeModal();
        } catch (error) {
            setError('An error occurred while saving.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this guest?')) return;
        try {
            const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchGuests();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const openModal = (guest?: any) => {
        setError('');
        if (guest) {
            setEditingGuest(guest);
            setFormData({
                firstName: guest.firstName,
                lastName: guest.lastName,
                email: guest.email || '',
                phone: guest.phone || '',
                address: guest.address || '',
                vipStatus: guest.vipStatus || 'Active'
            });
        } else {
            setEditingGuest(null);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', vipStatus: 'Active' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingGuest(null);
    };

    const filteredGuests = guests.filter(g =>
        String(g.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(g.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.email && String(g.email).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.phone && String(g.phone).includes(searchTerm))
    );

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Guest Directory</h1>
                    <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                        Manage your hotel guests, view histories, and update their profiles securely.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Guest
                    </button>
                </div>
            </div>

            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search guests by name, email, phone..."
                            className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-zinc-400 text-zinc-700 shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 rounded-lg">
                                <th className="px-6 py-4 font-semibold first:rounded-l-xl">Guest Name</th>
                                <th className="px-6 py-4 font-semibold">Contact Info</th>
                                <th className="px-6 py-4 font-semibold">Address</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right last:rounded-r-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredGuests.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-medium">No guests found.</td></tr>
                            ) : null}
                            {filteredGuests.map((guest, i) => (
                                <tr key={guest.id ? String(guest.id) : i} className="border-b border-zinc-100/50 last:border-0 hover:bg-zinc-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                {(String(guest.firstName || '')[0] || '')}{(String(guest.lastName || '')[0] || '')}
                                            </div>
                                            <div className="font-semibold text-zinc-900">{guest.firstName} {guest.lastName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-zinc-600 font-medium text-sm">
                                                <Mail className="w-3.5 h-3.5 text-zinc-400" /> {guest.email || 'No email provided'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-0.5">
                                                <Phone className="w-3.5 h-3.5 text-zinc-400" /> {guest.phone || 'No phone provided'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-start gap-1.5 text-zinc-600 font-medium max-w-[200px] truncate">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-1 flex-shrink-0" />
                                            <span className="truncate">{guest.address || 'Not specified'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${guest.vipStatus === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' : guest.vipStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                                            {guest.vipStatus || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(guest)} className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-zinc-400">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(String(guest.id))} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-zinc-400">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating / Editing Guest */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto w-full h-full">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden border border-zinc-200/50 my-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
                            <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 hover:bg-zinc-100 rounded-lg focus:outline-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveGuest}>
                            <div className="p-6 space-y-5">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                                        <input type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                                        <input type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                        <p className="text-xs text-zinc-500 mt-1">Must be unique across guests.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-1.5">Contact Number</label>
                                        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+44 7700 900000" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                        <p className="text-xs text-zinc-500 mt-1">Must be unique across guests.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Address</label>
                                    <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Example Street, City" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Status</label>
                                    <select value={formData.vipStatus} onChange={e => setFormData({ ...formData, vipStatus: e.target.value })} className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm">
                                        <option value="Active">Active</option>
                                        <option value="VIP">VIP</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-indigo-900 text-sm mt-4">
                                    <User className="w-5 h-5 flex-shrink-0 text-indigo-600" />
                                    <div>
                                        <p className="font-bold">Guest Directory Usage</p>
                                        <p className="text-indigo-700 mt-0.5 text-xs">Saved guests can be quickly selected when creating new reservations to skip manual data entry.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2">
                                    {isLoading ? 'Saving...' : 'Save Guest Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
