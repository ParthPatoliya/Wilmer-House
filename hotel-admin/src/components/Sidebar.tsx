'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    LayoutDashboard,
    CalendarDays,
    Users,
    Package,
    Sparkles
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reservations', href: '/reservations', icon: CalendarDays },
    { name: 'Staff Management', href: '/staff', icon: Users },
    { name: 'Inventory & Stock', href: '/inventory', icon: Package },
    { name: 'Housekeeping', href: '/cleaning', icon: Sparkles },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col hidden sm:flex shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 mb-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-indigo-500 rounded p-1.5 group-hover:bg-indigo-400 transition-colors">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">LuxeAdmin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 font-medium">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400'
                                : 'hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/20"></div>
                    <h4 className="text-sm font-semibold text-white mb-1">System Health</h4>
                    <p className="text-xs text-slate-400 mb-3">All services are running normally.</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Operational
                    </div>
                </div>
            </div>
        </aside>
    );
}
