'use client';

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Mail, Printer, XCircle, CreditCard, Calendar as CalendarIcon, Edit3, Loader2 } from 'lucide-react';
import InvoiceTemplate from './InvoiceTemplate';

interface ReservationTabProps {
    reservations: any[];
    fetchData: () => void;
}

export default function ReservationTab({ reservations, fetchData }: ReservationTabProps) {
    // states for modals
    const [selectedRes, setSelectedRes] = useState<any>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    // loaders
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    // form data
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [paymentData, setPaymentData] = useState({ method: 'Card', amount: '' });

    // Print ref
    const printRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Reservation_Confirmation',
    });

    const setLoader = (id: string, action: string, value: boolean) => {
        setLoadingMap(prev => ({ ...prev, [`${action}-${id}`]: value }));
    };

    const isSubmitting = (id: string, action: string) => !!loadingMap[`${action}-${id}`];

    const cancelReservation = async (res: any) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;
        setLoader(res.id, 'cancel', true);
        try {
            const response = await fetch('/api/reservations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: res.id, status: 'Cancelled' })
            });
            if (response.ok) {
                alert('Reservation Cancelled Successfully');
                fetchData();
            } else {
                alert('Failed to cancel reservation.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoader(res.id, 'cancel', false);
        }
    };

    const openEditDates = (res: any) => {
        setSelectedRes(res);
        setDates({
            checkIn: new Date(res.checkIn).toISOString().split('T')[0],
            checkOut: new Date(res.checkOut).toISOString().split('T')[0]
        });
        setEditModalOpen(true);
    };

    const saveDates = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(selectedRes.id, 'edit', true);
        try {
            const response = await fetch('/api/reservations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRes.id, checkIn: dates.checkIn, checkOut: dates.checkOut })
            });
            if (response.ok) {
                alert('Dates updated successfully');
                setEditModalOpen(false);
                fetchData();
            } else {
                alert('Failed to update dates');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoader(selectedRes.id, 'edit', false);
        }
    };

    const openPayment = (res: any) => {
        setSelectedRes(res);
        setPaymentData({ method: 'Card', amount: String(res.totalAmount) });
        setPaymentModalOpen(true);
    };

    const savePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(selectedRes.id, 'payment', true);
        try {
            // "Paid/Partial/Pending" based on amount vs total. simplified to Paid here.
            const status = Number(paymentData.amount) >= selectedRes.totalAmount ? 'Paid' : 'Partial';
            const response = await fetch('/api/reservations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRes.id, paymentStatus: status }) // Mock DB update
            });
            if (response.ok) {
                alert('Payment Recorded!');
                setPaymentModalOpen(false);
                fetchData();
            } else alert('Failed to record payment');
        } catch (e) {
            console.error(e);
        } finally {
            setLoader(selectedRes.id, 'payment', false);
        }
    };

    const sendEmail = async (res: any) => {
        setLoader(res.id, 'email', true);
        try {
            const response = await fetch('/api/email/reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: res.guest?.email || 'guest@example.com',
                    firstName: res.guest?.firstName,
                    lastName: res.guest?.lastName,
                    roomNumber: res.room?.number || 'TBD',
                    checkIn: res.checkIn,
                    checkOut: res.checkOut
                })
            });
            if (response.ok) {
                alert('Confirmation Email Sent!');
            } else {
                alert('Failed to send email. Check API key configuration.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoader(res.id, 'email', false);
        }
    };

    const triggerPrint = (res: any) => {
        setSelectedRes(res);
        setTimeout(() => handlePrint(), 100);
    };

    return (
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-500" /> Professional Management View
                </h3>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 rounded-xl">
                            <th className="px-6 py-4 font-semibold first:rounded-l-2xl">Guest Details</th>
                            <th className="px-6 py-4 font-semibold">Room & Dates</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right last:rounded-r-2xl">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {reservations.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-slate-500 font-medium">No bookings found</td></tr>
                        )}
                        {reservations.map((res: any) => (
                            <tr key={res.id} className="border-b border-slate-100/50 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-900 leading-none mb-1">{res.guest?.firstName} {res.guest?.lastName}</div>
                                    <div className="text-xs text-slate-500">{res.guest?.email || 'No email'}</div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Payment: {res.paymentStatus || 'Pending'}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-700 leading-none mb-1">Room {res.room?.number || 'TBA'} ({res.room?.type})</div>
                                    <div className="text-xs text-slate-500 font-medium">In: {new Date(res.checkIn).toLocaleDateString()} - Out: {new Date(res.checkOut).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${res.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : res.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                                    <button onClick={() => sendEmail(res)} disabled={isSubmitting(res.id, 'email')} title="Send Confirmation to Guest" className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm transition disabled:opacity-50">
                                        {isSubmitting(res.id, 'email') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => triggerPrint(res)} title="Print Confirmation PDF" className="p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition">
                                        <Printer className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => openEditDates(res)} disabled={res.status === 'Cancelled'} title="Edit Stay Dates" className="p-2 text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-lg shadow-sm transition disabled:opacity-50">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => openPayment(res)} disabled={res.status === 'Cancelled'} title="Record Payment" className="p-2 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm transition disabled:opacity-50">
                                        <CreditCard className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => cancelReservation(res)} disabled={res.status === 'Cancelled' || isSubmitting(res.id, 'cancel')} title="Cancel Reservation" className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg shadow-sm transition disabled:opacity-50">
                                        {isSubmitting(res.id, 'cancel') ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hidden Print Container */}
            <div className="hidden">
                <InvoiceTemplate reservation={selectedRes} ref={printRef} />
            </div>

            {/* Edit Date Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Update Dates</h2>
                        <form onSubmit={saveDates}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Check In</label>
                                    <input type="date" required value={dates.checkIn} onChange={e => setDates({ ...dates, checkIn: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Check Out</label>
                                    <input type="date" required value={dates.checkOut} onChange={e => setDates({ ...dates, checkOut: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500/30" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSubmitting(selectedRes?.id, 'edit')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold">Save Dates</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-500" /> Record Payment</h2>
                        <form onSubmit={savePayment}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Method</label>
                                    <select required value={paymentData.method} onChange={e => setPaymentData({ ...paymentData, method: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm">
                                        <option>Card</option>
                                        <option>Cash</option>
                                        <option>Online</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Amount Paid (£)</label>
                                    <input type="number" step="0.01" required value={paymentData.amount} onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" />
                                    <p className="text-xs text-slate-500 mt-1">Total Due: £{selectedRes?.totalAmount}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSubmitting(selectedRes?.id, 'payment')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                    {isSubmitting(selectedRes?.id, 'payment') && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
