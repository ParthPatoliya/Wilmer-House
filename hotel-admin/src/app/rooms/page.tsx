'use client';

import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Wifi, Tv, Coffee } from 'lucide-react';

const rooms = [
    { id: '101', type: 'Standard Room', status: 'Available', floor: 1, price: 120, amenities: ['Wifi', 'Tv'] },
    { id: '202', type: 'Deluxe Suite', status: 'Occupied', floor: 2, price: 250, amenities: ['Wifi', 'Tv', 'Coffee'] },
    { id: '305', type: 'Standard Room', status: 'Cleaning', floor: 3, price: 120, amenities: ['Wifi', 'Tv'] },
    { id: '401', type: 'Penthouse', status: 'Maintenance', floor: 4, price: 550, amenities: ['Wifi', 'Tv', 'Coffee'] },
    { id: '102', type: 'Standard Room', status: 'Available', floor: 1, price: 120, amenities: ['Wifi', 'Tv'] },
];

export default function RoomsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Room Details</h1>
                    <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                        Manage room inventory, statuses, and add new rooms to the property.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Room
                    </button>
                </div>
            </div>

            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by room number..."
                            className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-zinc-400 text-zinc-700 shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 rounded-lg">
                                <th className="px-6 py-4 font-semibold first:rounded-l-xl">Room No.</th>
                                <th className="px-6 py-4 font-semibold">Type & Floor</th>
                                <th className="px-6 py-4 font-semibold">Base Price</th>
                                <th className="px-6 py-4 font-semibold">Amenities</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right last:rounded-r-xl"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {rooms.map((room) => (
                                <tr key={room.id} className="border-b border-zinc-100/50 last:border-0 hover:bg-zinc-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="text-lg font-bold text-zinc-900 font-mono tracking-tight">{room.id}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-zinc-800">{room.type}</div>
                                            <div className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Floor {room.floor}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-zinc-700">${room.price}<span className="text-zinc-400 text-xs font-medium">/night</span></div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {room.amenities.map(a => (
                                                <span key={a} title={a} className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500 border border-zinc-200/60">
                                                    {a === 'Wifi' && <Wifi className="w-3.5 h-3.5" />}
                                                    {a === 'Tv' && <Tv className="w-3.5 h-3.5" />}
                                                    {a === 'Coffee' && <Coffee className="w-3.5 h-3.5" />}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                room.status === 'Occupied' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                    room.status === 'Cleaning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-700">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Adding Room */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden border border-zinc-200/50">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <h2 className="text-xl font-bold text-zinc-900">Add New Room</h2>
                            <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 hover:bg-zinc-100 rounded-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Room Number</label>
                                    <input type="text" placeholder="e.g. 501" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400 placeholder:font-sans" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Floor</label>
                                    <input type="number" placeholder="5" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Room Type</label>
                                    <select className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm">
                                        <option>Standard Room</option>
                                        <option>Deluxe Suite</option>
                                        <option>Penthouse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Base Price ($)</label>
                                    <input type="number" placeholder="150" className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm placeholder:text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">Amenities</label>
                                <div className="flex gap-3">
                                    {['Wifi', 'Tv', 'Coffee'].map(amenity => (
                                        <label key={amenity} className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors">
                                            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                            {amenity}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
                            <button onClick={() => setShowModal(false)} className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg">Add Room</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
