import React from 'react';

interface InvoiceTemplateProps {
    reservation: any;
}

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ reservation }, ref) => {
    if (!reservation) return null;

    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Fallback room rate if not directly available, based on total amount and nights
    const roomRate = reservation.room?.pricePerNight || (reservation.totalAmount / nights);

    // Generate Invoice ID based on booking reference and year
    const bookingRef = reservation.id ? reservation.id.split('-')[0].toUpperCase() : '000';
    const currentYear = new Date().getFullYear();
    const invoiceId = `WH-${currentYear}-${bookingRef}`;

    return (
        <div ref={ref} className="p-10 font-sans text-slate-800 bg-white mx-auto" style={{ width: '210mm', minHeight: '297mm', pointerEvents: 'none' }}>
            {/* Print specific styles to ensure UI is hidden and layout is perfect for A4 */}
            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                `}
            </style>

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderColor: '#2d5a27' }}>
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase mb-2" style={{ color: '#2d5a27' }}>Wilmer House</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#2d5a27]/70">Luxury Boutique Accommodation</p>
                </div>
                <div className="text-right text-sm">
                    <p className="font-bold">22 Wilmer Road</p>
                    <p>Eastleigh, SO50 5EX, UK</p>
                    <p className="mt-2 text-slate-500">
                        <span className="inline-block mr-3">📞 +44 7901 791886</span>
                        <span>✉️ wilmerguesthouse@gmail.com</span>
                    </p>
                </div>
            </div>

            {/* Invoice Meta */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: '#2d5a27' }}>Guest Invoice</h2>
                    <p className="text-sm font-mono text-slate-500">Invoice ID: {invoiceId}</p>
                    <p className="text-sm text-slate-500">Date Issued: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: '#2d5a27' }}>
                    <p className="text-white/80 text-xs uppercase tracking-wider font-bold mb-1">Status</p>
                    <p className="text-white font-bold text-lg leading-none">{reservation.paymentStatus || 'Pending'}</p>
                </div>
            </div>

            {/* Billing Details */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <p className="font-bold text-[#2d5a27] mb-2 uppercase text-xs tracking-wider border-b border-[#2d5a27]/20 pb-1">Billed To</p>
                    <p className="font-bold text-lg">{reservation.guest?.firstName} {reservation.guest?.lastName}</p>
                    <p className="text-sm">{reservation.guest?.email}</p>
                    <p className="text-sm">{reservation.guest?.phone}</p>
                    <p className="text-sm mt-1">{reservation.guest?.address || 'Address not provided'}</p>
                </div>
                <div>
                    <p className="font-bold text-[#2d5a27] mb-2 uppercase text-xs tracking-wider border-b border-[#2d5a27]/20 pb-1">Reservation Details</p>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="py-1 text-slate-500">Room:</td>
                                <td className="py-1 font-semibold text-right">{reservation.room?.number || 'TBA'} ({reservation.room?.type || 'Standard'})</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-slate-500">Check-in:</td>
                                <td className="py-1 font-semibold text-right">{checkInDate.toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-slate-500">Check-out:</td>
                                <td className="py-1 font-semibold text-right">{checkOutDate.toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-slate-500">Guests:</td>
                                <td className="py-1 font-semibold text-right">{reservation.adults} Adults, {reservation.children} Children</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial Breakdown */}
            <div className="mb-10">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: '#2d5a27' }}>
                            <th className="py-3 px-2 text-left font-bold text-[#2d5a27] uppercase tracking-wider text-xs">Description</th>
                            <th className="py-3 px-2 text-center font-bold text-[#2d5a27] uppercase tracking-wider text-xs">Rate</th>
                            <th className="py-3 px-2 text-center font-bold text-[#2d5a27] uppercase tracking-wider text-xs">Nights</th>
                            <th className="py-3 px-2 text-right font-bold text-[#2d5a27] uppercase tracking-wider text-xs">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="py-4 px-2 font-medium">Accommodation ({reservation.room?.type || 'Standard'})</td>
                            <td className="py-4 px-2 text-center">£{Number(roomRate).toFixed(2)}</td>
                            <td className="py-4 px-2 text-center">{nights}</td>
                            <td className="py-4 px-2 text-right font-medium">£{Number(reservation.totalAmount).toFixed(2)}</td>
                        </tr>
                        {/* Subtotal & Total */}
                        <tr>
                            <td colSpan={2} className="py-4 px-2 border-none"></td>
                            <td className="py-4 px-2 text-right text-slate-500 font-medium">Subtotal</td>
                            <td className="py-4 px-2 text-right font-medium">£{Number(reservation.totalAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="py-2 px-2 border-none"></td>
                            <td className="py-2 px-2 text-right text-slate-500 font-medium border-b border-slate-200">Tax/VAT (Included)</td>
                            <td className="py-2 px-2 text-right font-medium border-b border-slate-200">£0.00</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="py-4 px-2 border-none"></td>
                            <td className="py-4 px-2 text-right font-bold text-lg text-[#2d5a27]">Total Due</td>
                            <td className="py-4 px-2 text-right font-bold text-lg text-[#2d5a27]">£{Number(reservation.totalAmount).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Payment Info & Signatures */}
            <div className="grid grid-cols-2 gap-12 mb-16 mt-16">
                <div>
                    <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-slate-500">Bank Transfer Details</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                        <p className="mb-1"><span className="text-slate-500">Bank:</span> National Westminster Bank (NatWest)</p>
                        <p className="mb-1"><span className="text-slate-500">Account Name:</span> Wilmer House Ltd</p>
                        <p className="mb-1"><span className="text-slate-500">Sort Code:</span> XX-XX-XX</p>
                        <p className="mb-1"><span className="text-slate-500">Account No:</span> XXXXXXXX</p>
                        <p className="mt-2 text-xs text-slate-500 italic">Please use Invoice ID ({invoiceId}) as payment reference.</p>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end pt-10">
                    <div className="w-64 border-t-2 border-slate-300 pt-2 text-center">
                        <p className="font-bold" style={{ color: '#2d5a27' }}>Authorized Signature</p>
                        <p className="text-sm text-slate-500">Manager, Wilmer House</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Wilmer House is managed by Parth Patoliya.</p>
                <p className="mt-1">Thank you for choosing to stay with us!</p>
            </div>
        </div>
    );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
