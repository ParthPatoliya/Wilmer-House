import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const user = await prisma.user.findFirst({ where: { role: 'Admin' } });
        if (!user) {
            return NextResponse.json({ email: 'admin@wilmerhouse.com' }); // fallback
        }
        return NextResponse.json({ email: user.email });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find existing admin or we could findFirst
        let user = await prisma.user.findFirst({ where: { role: 'Admin' } });

        if (!user) {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
            user = await prisma.user.create({
                data: {
                    name: 'System Admin',
                    email: email || 'admin@wilmerhouse.com',
                    password: hashedPassword,
                    role: 'Admin'
                }
            });
            return NextResponse.json({ success: true });
        }

        const dataToUpdate: any = {};
        if (email) dataToUpdate.email = email;
        if (password && password.trim() !== '') {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update credentials' }, { status: 500 });
    }
}
