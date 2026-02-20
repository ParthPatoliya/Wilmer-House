'use client';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <header className="h-[76px] flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl sticky top-0 z-20 transition-all border-b border-zinc-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="flex-1 flex items-center">
                <form className="relative w-full max-w-lg hidden sm:block">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="search"
                        placeholder="Search guests, rooms, reports..."
                        className="w-full bg-zinc-100/50 hover:bg-zinc-100 focus:bg-white text-sm rounded-2xl pl-11 pr-4 py-2.5 border border-transparent focus:border-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-400 text-zinc-700 shadow-sm"
                    />
                </form>
            </div>

            <div className="flex items-center gap-5 relative">
                <button className="relative p-2.5 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white shadow-sm"></span>
                </button>

                <div className="h-8 w-[1px] bg-zinc-200"></div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-1 pl-4 pr-1.5 rounded-full hover:bg-zinc-100/80 transition-all border border-transparent focus:outline-none"
                    >
                        <div className="flex flex-col text-right hidden sm:flex">
                            <span className="text-sm font-bold text-zinc-800 leading-none">Admin User</span>
                            <span className="text-xs font-medium text-zinc-500 mt-1">General Manager</span>
                        </div>
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0"
                            alt="Profile avatar"
                            className="w-9 h-9 rounded-full bg-zinc-200 object-cover ring-2 ring-white shadow-md"
                        />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right backdrop-blur-xl">
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full text-left px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                            >
                                <UserCircle className="w-4 h-4" />
                                My Profile
                            </button>
                            <div className="border-t border-zinc-100 my-1"></div>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full text-left px-5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
