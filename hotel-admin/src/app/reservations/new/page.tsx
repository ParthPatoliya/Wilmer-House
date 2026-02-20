'use client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewReservationPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/reservations" className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create Reservation</h1>
                        <p className="text-sm text-slate-500 mt-1">Book a new room for a guest.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/reservations" className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
                        Cancel
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                        <Save className="w-4 h-4" />
                        Complete Booking
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            Guest Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">First Name</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. John" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Last Name</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                <input type="tel" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            Stay Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Check-in Date</label>
                                <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Check-out Date</label>
                                <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Room Type</label>
                                <select className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all bg-white text-slate-700">
                                    <option>Select room type</option>
                                    <option>Standard Single</option>
                                    <option>Deluxe Double</option>
                                    <option>Ocean View Suite</option>
                                    <option>Penthouse Application</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Number of Guests</label>
                                <input type="number" min="1" max="10" defaultValue="1" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            Payment & Summary
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Subtotal</span>
                                <span className="text-sm font-medium text-slate-900">£0.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-slate-600">Taxes & Fees</span>
                                <span className="text-sm font-medium text-slate-900">£0.00</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                                <span className="font-semibold text-slate-900">Total Estimated Cost</span>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">£0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
