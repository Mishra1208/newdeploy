import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/protected(.*)', // We can add protected routes here later
]);

export default clerkMiddleware(async (auth, req) => {
    // Domain Redirect Logic: Force generic Vercel domains to custom domain
    // we use "hostname" from nextUrl for reliability
    const hostname = req.nextUrl.hostname;
    // or fallback to headers if needed
    // const hostHeader = req.headers.get("host");

    if (hostname.includes("vercel.app")) {
        const newUrl = new URL(req.nextUrl.pathname, "https://www.conuplanner.com");
        newUrl.search = req.nextUrl.search;
        return NextResponse.redirect(newUrl);
    }

    if (isProtectedRoute(req)) await auth.protect();
}, {
    // Allow all routes by default for the "Quick Look" experience
    // We only protect specific routes if we add them to the matcher above
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
