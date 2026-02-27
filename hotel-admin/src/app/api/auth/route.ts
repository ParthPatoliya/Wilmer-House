import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        let user = await prisma.user.findUnique({
            where: { email }
        });

        // Initialize admin on first usage or if password is not set
        if (email === 'admin@wilmerhouse.com' && password === 'admin123') {
            if (!user) {
                const adminCount = await prisma.user.count({ where: { role: 'Admin' } });
                if (adminCount === 0) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user = await prisma.user.create({
                        data: {
                            name: 'System Admin',
                            email: 'admin@wilmerhouse.com',
                            password: hashedPassword,
                            role: 'Admin'
                        }
                    });
                }
            } else if (!user.password) {
                // User exists but has no password set, let's set it
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await prisma.user.update({
                    where: { email: 'admin@wilmerhouse.com' },
                    data: { password: hashedPassword }
                });
            }
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        if (!user.password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: 'hotel_admin_auth',
            value: 'authenticated',
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 2 // 2 hours context
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
    }
}
