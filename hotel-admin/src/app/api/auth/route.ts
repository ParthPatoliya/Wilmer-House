import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Hardcoded admin email and password for right now. Easiest to deploy quickly based on requirements.
        if (email === 'admin@wilmerhouse.com' && password === 'admin123') {
            const response = NextResponse.json({ success: true });
            response.cookies.set({
                name: 'hotel_admin_auth',
                value: 'authenticated',
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            return response;
        }

        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
    }
}
