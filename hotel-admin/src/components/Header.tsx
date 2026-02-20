'use client';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="flex-1 flex items-center">
                <form className="relative w-full max-w-md hidden sm:block">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="search"
                        placeholder="Search guests, rooms, queries..."
                        className="w-full bg-slate-100/50 text-sm rounded-full pl-10 pr-4 py-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-400 text-slate-700"
                    />
                </form>
            </div>

            <div className="flex items-center gap-4 relative">
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 border border-white"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 focus:outline-none focus:bg-slate-100"
                    >
                        <div className="flex flex-col text-right hidden sm:flex">
                            <span className="text-sm font-semibold text-slate-700 leading-none">Admin</span>
                            <span className="text-xs text-slate-500 mt-1">Manager</span>
                        </div>
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0"
                            alt="Profile avatar"
                            className="w-8 h-8 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-sm"
                        />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <UserCircle className="w-4 h-4 text-slate-400" />
                                My Profile
                            </button>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
