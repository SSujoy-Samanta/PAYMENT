// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthApiMiddleware, AuthMiddleware, PostSignInMiddleware } from "./utils/Middleware/authMid";
import { rateLimit } from "./utils/Middleware/ratelimit";

// Specify paths to match for this middleware
export const config = {
  matcher: [
    "/api/:path*",
    "/signup/:path*",
    "/signin/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/transactions/:path*",
    "/transfer/:path*",
  ],
};

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/api")) {
        const rateLimitResponse = await rateLimit(req);
        if (!rateLimitResponse.success) {
        return NextResponse.json(
            { message: rateLimitResponse.message },
            { status: 429 },
        );
        }
    }
    // Apply authentication middleware for specific paths
    if (
        // req.nextUrl.pathname.startsWith("/api/app") ||
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/transactions") ||
        req.nextUrl.pathname.startsWith("/transfer")
    ) {
        const authResponse = await AuthMiddleware(req);
        if (authResponse) {
        return authResponse; // Redirect or allow request based on authentication
        }
    }
    // Apply authentication middleware for specific paths in api
    if (
        req.nextUrl.pathname.startsWith("/api/v1")  
    ){
        const authResponse = await AuthApiMiddleware(req);
        if (authResponse) {
            return authResponse; 
        }
    }

    if (
        req.nextUrl.pathname.startsWith("/signin") ||
        req.nextUrl.pathname.startsWith("/signup")
    ) {
        const authResponse = await PostSignInMiddleware(req);
        if (authResponse) {
        return authResponse;
        }
    }

    return NextResponse.next();
}
