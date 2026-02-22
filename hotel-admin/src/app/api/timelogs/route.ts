import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const timeLogs = await prisma.timeLog.findMany({
            include: { employee: true },
            orderBy: { clockIn: 'desc' }
        });
        return NextResponse.json(timeLogs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch time logs' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { employeeId, clockIn, clockOut, notes } = body;

        const newLog = await prisma.timeLog.create({
            data: {
                employeeId,
                clockIn: new Date(clockIn),
                clockOut: clockOut ? new Date(clockOut) : null,
                status: clockOut ? 'Completed' : 'Active',
                notes
            }
        });
        return NextResponse.json(newLog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create manual past time sheet' }, { status: 500 });
    }
}
