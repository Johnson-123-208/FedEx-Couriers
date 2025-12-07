import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    return NextResponse.json({ message: "Use Supabase Client SDK for Authentication" });
}

export async function GET(request: Request) {
    return NextResponse.json({
        endpoints: [
            "POST /api/auth/login",
            "POST /api/auth/register",
            "GET /api/auth/session"
        ],
        info: "Authentication is handled via @supabase/supabase-js on the client side. This route is a placeholder."
    });
}
