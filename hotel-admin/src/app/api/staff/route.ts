import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const staff = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const employee = await prisma.employee.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                niNumber: data.niNumber,
                hourlyRate: parseFloat(data.hourlyRate) || 0,
                employmentType: data.employmentType,
                contractType: data.contractType,
                role: data.role || 'Staff'
            }
        });
        return NextResponse.json(employee);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to create staff' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.employee.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to delete staff' }, { status: 500 });
    }
}
