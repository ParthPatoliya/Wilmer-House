import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const templates = await prisma.emailTemplate.findMany();
        if (templates.length === 0) {
            // Seed defaults
            await prisma.emailTemplate.createMany({
                data: [
                    { type: 'Reservation', subject: 'Booking Confirmation - Wilmer House', body: 'Dear {{name}},\n\nThank you for choosing to stay with us at Wilmer House.\n\nWe are delighted to confirm your reservation for a {{room}} arriving on {{checkIn}} and departing on {{checkOut}}.\n\nIMPORTANT: For your security and to speed up your check-in process, please upload a secure copy of your Photo ID using this secure portal link: [Link to Secure ID Portal]\n\nIf you have any questions or require special accommodations during your stay, please reply directly to this email.\n\nWarm regards,\nThe Wilmer House Hotel Team' },
                    { type: 'Payment', subject: 'Payment Receipt - Wilmer House', body: 'Dear {{name}},\n\nWe have successfully received your payment of {{amount}} for your upcoming stay at Wilmer House.\n\nWe look forward to welcoming you soon!\n\nWarm regards,\nThe Wilmer House Hotel Team' }
                ]
            });
            return NextResponse.json(await prisma.emailTemplate.findMany());
        }
        return NextResponse.json(templates);
    } catch (error) {
        console.error("GET email error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const t = await prisma.emailTemplate.update({
            where: { type: data.type },
            data: { subject: data.subject, body: data.body }
        });
        return NextResponse.json(t);
    } catch (error) {
        console.error("PUT email error:", error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}
