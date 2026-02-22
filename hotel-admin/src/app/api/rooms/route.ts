import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { number: 'asc' }
        });
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const room = await prisma.room.create({
            data: {
                number: data.number,
                type: data.type,
                pricePerNight: parseFloat(data.price),
                status: data.status || 'Available',
                photoUrl: data.photoUrl || null
            }
        });
        return NextResponse.json(room);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to create room' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const room = await prisma.room.update({
            where: { id: data.id },
            data: {
                number: data.number,
                type: data.type,
                pricePerNight: parseFloat(data.price),
                status: data.status,
                photoUrl: data.photoUrl || null
            }
        });
        return NextResponse.json(room);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update room' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.room.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to delete room' }, { status: 500 });
    }
}
