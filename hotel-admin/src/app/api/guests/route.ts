import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const guests = await prisma.guest.findMany({
            orderBy: { firstName: 'asc' }
        });
        return NextResponse.json(guests);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, address } = body;

        const vEmail = email?.trim() || null;
        const vPhone = phone?.trim() || null;

        // Check if guest exists
        if (vEmail || vPhone) {
            const conditions = [];
            if (vEmail) conditions.push({ email: vEmail });
            if (vPhone) conditions.push({ phone: vPhone });

            const existingGuest = await prisma.guest.findFirst({
                where: { OR: conditions }
            });

            if (existingGuest) {
                const dupField = existingGuest.email === vEmail ? 'email address' : 'contact number';
                return NextResponse.json({ error: `Guest with this ${dupField} already exists` }, { status: 400 });
            }
        }

        const newGuest = await prisma.guest.create({
            data: {
                firstName,
                lastName,
                email: vEmail,
                phone: vPhone,
                address,
            }
        });

        return NextResponse.json(newGuest);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, firstName, lastName, email, phone, address } = body;

        const vEmail = email?.trim() || null;
        const vPhone = phone?.trim() || null;

        if (vEmail || vPhone) {
            const conditions = [];
            if (vEmail) conditions.push({ email: vEmail });
            if (vPhone) conditions.push({ phone: vPhone });

            const existingGuest = await prisma.guest.findFirst({
                where: {
                    OR: conditions,
                    NOT: { id }
                }
            });

            if (existingGuest) {
                const dupField = existingGuest.email === vEmail ? 'email address' : 'contact number';
                return NextResponse.json({ error: `Another guest with this ${dupField} already exists` }, { status: 400 });
            }
        }

        const updatedGuest = await prisma.guest.update({
            where: { id },
            data: { firstName, lastName, email: vEmail, phone: vPhone, address },
        });

        return NextResponse.json(updatedGuest);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
        }

        await prisma.reservation.deleteMany({ where: { guestId: id } });
        await prisma.guest.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
    }
}
