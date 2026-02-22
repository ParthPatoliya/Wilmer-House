import { TrendingUp, Users, CheckCircle, Clock, ChevronRight, Download, Calendar, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [totalReservations, guestsCount, pendingReservations, recentBookings] = await Promise.all([
    prisma.reservation.aggregate({ _sum: { totalAmount: true } }),
    prisma.guest.count(),
    prisma.reservation.count({ where: { status: 'Pending' } }),
    prisma.reservation.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { guest: true, room: true }
    })
  ]);

  const totalRevenue = totalReservations._sum.totalAmount || 0;

  const stats = [
    { name: 'Total Revenue', value: `£${totalRevenue.toLocaleString()}`, change: '+Daily sync', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Total Guests', value: guestsCount.toString(), change: 'Directory', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'System Load', value: 'Active', change: 'Online', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Pending Approvals', value: pendingReservations.toString(), change: 'Requires Action', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Live Dashboard Overview</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
            <span>Welcome back, Admin</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>Real-time status updates from Wilmer House database.</span>
          </p>
        </div>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Today's Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group overflow-hidden relative">
            <div className={`absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-white to-${stat.color.split('-')[1]}-50 rounded-bl-full opacity-30 -z-10 group-hover:scale-110 transition-transform`}></div>
            <div className="flex items-center justify-between z-10">
              <div>
                <p className="text-sm font-semibold text-zinc-500 mb-2 uppercase tracking-widest">{stat.name}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-4xl font-black tracking-tight text-zinc-900">{stat.value}</p>
                </div>
                <div className="mt-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${stat.change.includes('Action') || stat.change.includes('-') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-3xl ${stat.bg} shadow-sm self-start`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-zinc-200/60 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> Recent Bookings
            </h3>
            <Link href="/reservations" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 rounded-xl">
                  <th className="px-6 py-4 font-semibold first:rounded-l-2xl">Guest Details</th>
                  <th className="px-6 py-4 font-semibold">Room & Dates</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right last:rounded-r-2xl">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 font-medium">No recent bookings found.</td>
                  </tr>
                ) : (
                  recentBookings.map((row: any) => (
                    <tr key={row.id} className="border-b border-zinc-100/50 last:border-0 hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-xs">
                            {row.guest?.firstName?.[0]}{row.guest?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 leading-none mb-1">{row.guest?.firstName} {row.guest?.lastName}</div>
                            <div className="text-xs text-zinc-500">{row.guest?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-zinc-700 leading-none mb-1">{row.room?.number || 'TBD'} - {row.room?.type || 'Unknown'}</div>
                        <div className="text-xs text-zinc-500 font-medium">In: {new Date(row.checkIn).toLocaleDateString()} - Out: {new Date(row.checkOut).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${row.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : row.status === 'Checked In' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-black text-zinc-800 text-right text-base text-indigo-900 border-indigo-100">£{row.totalAmount?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl p-8 text-white shadow-[0_8px_30px_rgba(79,70,229,0.2)] relative overflow-hidden flex flex-col h-full border border-indigo-500/30">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

          <div className="relative z-10 flex-1 flex flex-col text-left">
            <h3 className="text-xl font-bold mb-2 tracking-tight">System Navigation Shortcuts</h3>
            <p className="text-sm font-medium text-indigo-200 mb-8 leading-relaxed">Quickly jump to important workflows and manage the hotel with ease.</p>

            <div className="space-y-4 mt-auto">
              <Link href="/reservations" className="block w-full">
                <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm shadow-sm hover:shadow-md">
                  <span className="font-bold text-sm group-hover:text-white text-indigo-50 transition-colors tracking-wide">Premium Calendar</span>
                  <span className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold shadow-inner flex items-center gap-1">Go <ChevronRight className="w-3 h-3" /></span>
                </button>
              </Link>
              <Link href="/rota" className="block w-full">
                <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm shadow-sm hover:shadow-md">
                  <span className="font-bold text-sm group-hover:text-white text-indigo-50 transition-colors tracking-wide">Staff & Timesheets</span>
                  <span className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold shadow-inner flex items-center gap-1">Manage <ChevronRight className="w-3 h-3" /></span>
                </button>
              </Link>
              <Link href="/guests" className="block w-full">
                <button className="w-full flex items-center justify-between bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-5 py-4 rounded-2xl transition-all group backdrop-blur-sm shadow-sm hover:shadow-md">
                  <span className="font-bold text-sm group-hover:text-white text-indigo-50 transition-colors tracking-wide">Guest Directory</span>
                  <span className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-indigo-900 border border-indigo-400">Database</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
