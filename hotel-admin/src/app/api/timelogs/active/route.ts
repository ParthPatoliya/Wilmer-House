import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');

        if (!employeeId) return NextResponse.json({ error: 'Missing employeeId' }, { status: 400 });

        const activeLog = await prisma.timeLog.findFirst({
            where: { employeeId, status: 'Active' },
            orderBy: { clockIn: 'desc' }
        });

        return NextResponse.json(activeLog || { none: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { employeeId } = body;

        // Check if already clocked in
        const existing = await prisma.timeLog.findFirst({
            where: { employeeId, status: 'Active' }
        });
        if (existing) return NextResponse.json(existing);

        const newLog = await prisma.timeLog.create({
            data: {
                employeeId,
                status: 'Active'
            }
        });
        return NextResponse.json(newLog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to clock in' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { employeeId } = body;

        const activeLog = await prisma.timeLog.findFirst({
            where: { employeeId, status: 'Active' }
        });

        if (!activeLog) return NextResponse.json({ error: 'Not clocked in' }, { status: 400 });

        const updated = await prisma.timeLog.update({
            where: { id: activeLog.id },
            data: {
                clockOut: new Date(),
                status: 'Completed'
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to clock out' }, { status: 500 });
    }
}
