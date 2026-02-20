import { Sparkles, CalendarCheck, CheckCircle2, Clock, MapPin, MoreHorizontal } from 'lucide-react';

const tasks = [
    { id: 'HK-102', room: '102 - Ocean View Suite', assignee: 'Esther Howard', type: 'Check-out Cleaning', status: 'In Progress', priority: 'High', time: '10:00 AM' },
    { id: 'HK-205', room: '205 - Standard Double', assignee: 'Unassigned', type: 'Stay-over Service', status: 'Pending', priority: 'Medium', time: '12:30 PM' },
    { id: 'HK-501', room: '501 - Penthouse', assignee: 'Maria Garcia', type: 'Deep Cleaning', status: 'Completed', priority: 'Low', time: '09:15 AM' },
    { id: 'HK-310', room: '310 - Deluxe Single', assignee: 'James Wilson', type: 'Check-out Cleaning', status: 'In Progress', priority: 'High', time: '11:45 AM' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'In Progress':
            return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case 'Pending':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'text-rose-600 bg-rose-50';
    if (priority === 'Medium') return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
};

export default function CleaningPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Housekeeping</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage room cleaning schedules and priorities.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                        <Sparkles className="w-4 h-4" />
                        Assign Tasks
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-slate-700">Total Tasks</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-auto">24</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-slate-700">Pending</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-auto">8</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-slate-700">In Progress</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-auto">12</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-slate-700">Completed</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-auto">4</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Today&apos;s Schedule</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 rounded-md">Filters Active</span>
                        <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Clear</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {tasks.map((task) => (
                        <div key={task.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex-shrink-0">
                                    <div className={`w-3 h-3 rounded-full mt-1.5 ${task.status === 'Completed' ? 'bg-emerald-500' :
                                        task.status === 'In Progress' ? 'bg-indigo-500 animate-pulse' : 'bg-amber-400'
                                        }`}></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">{task.room}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {task.type}
                                        </span>
                                        <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {task.time}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                                            {task.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:items-end gap-3 sm:gap-4 pl-7 sm:pl-0 border-t border-slate-100 pt-4 sm:pt-0 sm:border-0 border-dashed">
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Assigned to</p>
                                        <p className={`font-semibold text-sm ${task.assignee === 'Unassigned' ? 'text-amber-600' : 'text-slate-900'}`}>{task.assignee}</p>
                                    </div>
                                    {task.assignee !== 'Unassigned' ? (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold flex flex-shrink-0 items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            {task.assignee.charAt(0)}
                                        </div>
                                    ) : (
                                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">Assign</button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">View Details</button>
                                    <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
