import { UserPlus, MoreVertical, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

const staffMembers = [
    { id: 'SM-01', name: 'Robert Fox', role: 'Front Desk Manager', status: 'On Shift', avatar: 'bg-indigo-100 text-indigo-600', hours: '40h/wk', performance: 'Excellent' },
    { id: 'SM-02', name: 'Esther Howard', role: 'Housekeeping Lead', status: 'Off Shift', avatar: 'bg-rose-100 text-rose-600', hours: '35h/wk', performance: 'Good' },
    { id: 'SM-03', name: 'Albert Flores', role: 'Maintenance Tech', status: 'On Shift', avatar: 'bg-amber-100 text-amber-600', hours: '45h/wk', performance: 'Average' },
    { id: 'SM-04', name: 'Jenny Wilson', role: 'Concierge', status: 'On Leave', avatar: 'bg-emerald-100 text-emerald-600', hours: '20h/wk', performance: 'Excellent' },
];

export default function StaffPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage employees, track shifts, and performance.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Staff</p>
                        <p className="text-2xl font-bold text-slate-900">42</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Currently on Shift</p>
                        <p className="text-2xl font-bold text-slate-900">18</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Managers Active</p>
                        <p className="text-2xl font-bold text-slate-900">3</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Hours/Wk</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {staffMembers.map((staff) => (
                                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-xl font-bold ${staff.avatar}`}>
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{staff.name}</p>
                                                <p className="text-xs text-slate-500">{staff.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{staff.role}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${staff.status === 'On Shift' ? 'bg-emerald-500 animate-pulse' :
                                                    staff.status === 'Off Shift' ? 'bg-slate-300' : 'bg-amber-500'
                                                }`}></span>
                                            <span className="text-sm text-slate-600">{staff.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{staff.hours}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            {staff.performance}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 hover:bg-indigo-50">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Ensure icon imports missing from lucide-react above
import { Users } from 'lucide-react';
