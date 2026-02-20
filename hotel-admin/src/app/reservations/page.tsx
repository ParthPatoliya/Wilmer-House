import { Calendar, Filter, Plus, Search, MoreHorizontal } from 'lucide-react';

const reservations = [
    { id: 'RES-001', guest: 'Alexandra Smith', room: 'Ocean View Suite (102)', dates: 'Oct 12 - Oct 15', status: 'Confirmed', amount: '£850' },
    { id: 'RES-002', guest: 'David Johnson', room: 'Standard Double (205)', dates: 'Oct 14 - Oct 18', status: 'Checked In', amount: '£420' },
    { id: 'RES-003', guest: 'Emily Chen', room: 'Penthouse (501)', dates: 'Oct 20 - Oct 25', status: 'Pending', amount: '£2,500' },
    { id: 'RES-004', guest: 'Michael Brown', room: 'Deluxe Single (310)', dates: 'Oct 11 - Oct 13', status: 'Checked Out', amount: '£300' },
    { id: 'RES-005', guest: 'Sarah Williams', room: 'Ocean View Suite (104)', dates: 'Oct 15 - Oct 20', status: 'Confirmed', amount: '£1,200' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Confirmed': return 'bg-emerald-100 text-emerald-700';
        case 'Checked In': return 'bg-indigo-100 text-indigo-700';
        case 'Pending': return 'bg-amber-100 text-amber-700';
        case 'Checked Out': return 'bg-slate-100 text-slate-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default function ReservationsPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage guest bookings, check-ins, and statuses.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                    <Plus className="w-4 h-4" />
                    New Reservation
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-slate-50/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by guest or ID..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            <Calendar className="w-4 h-4" />
                            Dates
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Guest Info</th>
                                <th className="px-6 py-4">Room Detail</th>
                                <th className="px-6 py-4">Stay Dates</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{res.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {res.guest.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{res.guest}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{res.room}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{res.dates}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{res.amount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
                    <span>Showing 1 to 5 of 45 entries</span>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50">2</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50">3</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
