import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Placeholder if missing

export async function POST(req: Request) {
    try {
        const { email, firstName, lastName, roomNumber, checkIn, checkOut } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'Wilmer House <reservations@wilmerhouse.com>', // Replace with verified domain
            to: [email],
            subject: 'Reservation Confirmed - Wilmer House',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Your stay at Wilmer House is confirmed!</h2>
                    <p>Dear ${firstName} ${lastName},</p>
                    <p>We are delighted to confirm your reservation at Wilmer House.</p>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #334155;">Reservation Details:</h3>
                        <p><strong>Room:</strong> ${roomNumber}</p>
                        <p><strong>Check-In:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
                        <p><strong>Check-Out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
                    </div>

                    <p>We look forward to welcoming you.</p>
                    <p>Best regards,<br>The Wilmer House Team</p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
                    <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
                        <p style="margin: 0; font-weight: bold; color: #2d5a27;">Wilmer House</p>
                        <p style="margin: 0;">22 Wilmer Road, Eastleigh, SO50 5EX, UK</p>
                        <p style="margin: 0;">+44 7901 791886 | wilmerguesthouse@gmail.com</p>
                        <p style="margin-top: 10px; font-style: italic;">Wilmer House is managed by Parth Patoliya.</p>
                    </div>
                </div>
            `
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }
}
