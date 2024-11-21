import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const AuthMiddleware = async (
  req: NextRequest,
): Promise<NextResponse> => {
    const token = await getToken({
        req: req as any,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        return NextResponse.redirect(new URL("api/auth/signin", req.url));
    }

    return NextResponse.next();
};

export const AuthApiMiddleware = async (
    req: NextRequest,
  ): Promise<NextResponse> => {
    const token = await getToken({
        req: req as any,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        return NextResponse.json({message:"Please LogIn First"},{status:401});
    }

    return NextResponse.next();
};

export const PostSignInMiddleware = async (
  req: NextRequest,
): Promise<NextResponse> => {
    const token = await getToken({
        req: req as any,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
};