import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let profile = await prisma.hotelProfile.findFirst();
        if (!profile) {
            profile = await prisma.hotelProfile.create({
                data: {}
            });
        }
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const profile = await prisma.hotelProfile.findFirst();
        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        const updated = await prisma.hotelProfile.update({
            where: { id: profile.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address
            }
        });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update profile' }, { status: 500 });
    }
}
