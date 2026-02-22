import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('hotel_admin_auth');
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    // Ignore api routes or static files checking
    if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.includes('.')) {
        return NextResponse.next();
    }

    if (!authCookie && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
