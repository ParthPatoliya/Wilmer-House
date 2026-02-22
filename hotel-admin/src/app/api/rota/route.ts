import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const shifts = await prisma.shift.findMany({
            include: { employee: true },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(shifts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const shift = await prisma.shift.create({
            data: {
                employeeId: data.employeeId,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                breakStartTime: data.breakStartTime,
                breakEndTime: data.breakEndTime,
                breakMinutes: parseInt(data.breakMinutes) || 0,
                status: data.status || 'Scheduled'
            },
            include: { employee: true }
        });
        return NextResponse.json(shift);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to create shift' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const shift = await prisma.shift.update({
            where: { id: data.id },
            data: {
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                breakStartTime: data.breakStartTime,
                breakEndTime: data.breakEndTime,
                breakMinutes: parseInt(data.breakMinutes) || 0,
                status: data.status
            },
            include: { employee: true }
        });
        return NextResponse.json(shift);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update shift' }, { status: 500 });
    }
}
