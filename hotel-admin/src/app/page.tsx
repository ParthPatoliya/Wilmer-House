import { TrendingUp, Users, CheckCircle, Clock, ChevronRight } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '£45,231', change: '+20.1%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Active Guests', value: '142', change: '+12.5%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Rooms Cleaned', value: '45/60', change: '75%', icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Pending Requests', value: '12', change: '-2.4%', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function Home() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
            <span>Welcome back, Admin</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>Here's what's happening at LuxeHotel today.</span>
          </p>
        </div>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-white to-zinc-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between z-10">
              <div>
                <p className="text-sm font-semibold text-zinc-500 mb-2">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold tracking-tight text-zinc-900">{stat.value}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.bg} shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">Recent Bookings</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 rounded-lg">
                  <th className="px-6 py-4 font-semibold first:rounded-l-xl">Guest Name</th>
                  <th className="px-6 py-4 font-semibold">Room Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right last:rounded-r-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Sarah Jenkins', room: 'Deluxe Suite 402', status: 'Confirmed', amount: '£450.00', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { name: 'Michael Chen', room: 'Standard 210', status: 'Pending', amount: '£120.00', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { name: 'Emma Watson', room: 'Penthouse', status: 'Checked In', amount: '£1,200.00', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                  { name: 'David Smith', room: 'Standard 105', status: 'Confirmed', amount: '£150.00', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-100/50 last:border-0 hover:bg-zinc-50/80 transition-colors group">
                    <td className="px-6 py-5 font-semibold text-zinc-900">{row.name}</td>
                    <td className="px-6 py-5 font-medium text-zinc-500">{row.room}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-zinc-700 text-right">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-8 text-white shadow-[0_8px_30px_rgba(79,70,229,0.2)] relative overflow-hidden flex flex-col h-full">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

          <div className="relative z-10 flex-1 flex flex-col text-left">
            <h3 className="text-xl font-bold mb-2 tracking-tight">Quick Actions</h3>
            <p className="text-sm font-medium text-indigo-200 mb-8 leading-relaxed">Need to handle something immediately? Use these shortcuts for faster management.</p>

            <div className="space-y-4 mt-auto">
              <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm">
                <span className="font-semibold text-sm group-hover:text-white text-indigo-50 transition-colors">New Reservation</span>
                <span className="bg-white/20 p-1.5 rounded-lg text-xs font-bold shadow-sm">+ Add</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm">
                <span className="font-semibold text-sm group-hover:text-white text-indigo-50 transition-colors">Assign Housekeeping</span>
                <span className="bg-indigo-500 text-white p-1.5 rounded-lg text-xs font-bold shadow-sm">3 pending</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm">
                <span className="font-semibold text-sm group-hover:text-white text-indigo-50 transition-colors">Check Inventory</span>
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
