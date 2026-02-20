'use client';

import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            window.location.href = '/';
        }, 800);
    };

    return (
        <div className="w-full max-w-[400px] flex flex-col items-center">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl p-3 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-zinc-900">LuxeAdmin</span>
            </Link>

            <div className="w-full bg-white border border-zinc-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <h1 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight text-center relative z-10">Welcome back</h1>
                <p className="text-sm font-medium text-zinc-500 mb-8 text-center relative z-10">Enter your credentials to access the admin panel.</p>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@luxehotel.com"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all placeholder:text-zinc-400 font-medium font-sans shadow-sm"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-zinc-700">Password</label>
                            <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all placeholder:text-zinc-400 font-medium font-sans shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-semibold text-zinc-500 relative z-10">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-2 py-1 rounded-md">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}
