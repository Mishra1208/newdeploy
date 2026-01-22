import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl;
    const hostname = url.hostname;

    // Redirect conuplanner.vercel.app -> conuplanner.com
    if (hostname === 'conu-planner-seven.vercel.app' || hostname.endsWith('.vercel.app')) {
        // Exclude localhost for dev safety, though hostname usually handles this
        if (hostname !== 'localhost') {
            const newUrl = new URL(url.pathname, 'https://conuplanner.com');
            newUrl.search = url.search;
            return NextResponse.redirect(newUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
