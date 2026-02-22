import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: 'hotel_admin_auth',
            value: '',
            httpOnly: true,
            path: '/',
            expires: new Date(0)
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}
