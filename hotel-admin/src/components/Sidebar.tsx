'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    LayoutDashboard,
    CalendarDays,
    Users,
    Package,
    BedDouble,
    Settings
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Guest & Reservations', href: '/guests', icon: CalendarDays },
    { name: 'Room Details', href: '/rooms', icon: BedDouble },
    { name: 'Staff Management', href: '/staff', icon: Users },
    { name: 'Stock Management', href: '/inventory', icon: Package },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[280px] bg-[#0A0A0B] border-r border-white/5 text-zinc-400 flex flex-col hidden sm:flex shrink-0 relative overflow-hidden">
            {/* Subtle top gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="h-20 flex items-center px-8 mb-4 relative z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl p-2 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">LuxeAdmin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 font-medium relative z-10">
                <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-2">Main Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive
                                ? 'text-white bg-white/[0.04]'
                                : 'hover:bg-white/[0.02] hover:text-zinc-200'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-md shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            )}
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto relative z-10">
                <Link href="/settings" className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/[0.02] hover:text-zinc-200 text-zinc-400 mb-2">
                    <Settings className="w-5 h-5 text-zinc-500" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>

                <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl p-5 border border-white/[0.05] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-200">System Status</h4>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">All services operational</p>
                </div>
            </div>
        </aside>
    );
}
