import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Active Guests', value: '142', change: '+12.5%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Rooms Cleaned', value: '45/60', change: '75%', icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Pending Requests', value: '12', change: '-2.4%', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function Home() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Daily Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening at LuxeHotel today.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 hidden">
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Sarah Jenkins', room: 'Deluxe Suite 402', status: 'Confirmed', amount: '$450.00', color: 'bg-emerald-100 text-emerald-700' },
                  { name: 'Michael Chen', room: 'Standard 210', status: 'Pending', amount: '$120.00', color: 'bg-amber-100 text-amber-700' },
                  { name: 'Emma Watson', room: 'Penthouse', status: 'Checked In', amount: '$1,200.00', color: 'bg-indigo-100 text-indigo-700' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{row.name}</td>
                    <td className="py-3 text-slate-500">{row.room}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-700">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
            <p className="text-sm text-indigo-200 mb-6">Need to handle something immediately?</p>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-all">
                <span className="font-medium text-sm">New Reservation</span>
                <span className="bg-white/20 p-1 rounded-md text-xs font-bold px-2">+</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-all">
                <span className="font-medium text-sm">Assign Housekeeping</span>
                <span className="bg-indigo-500 text-white p-1 rounded-md text-xs font-bold px-2">3 pending</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-all">
                <span className="font-medium text-sm">Check Inventory</span>
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
