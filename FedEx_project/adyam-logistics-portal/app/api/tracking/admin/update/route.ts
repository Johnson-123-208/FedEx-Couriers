import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, updates } = body;

        // Check for admin role (In a real app, use Supabase Auth Session from request cookies)
        // For this foundation, we just try to update. RLS will block if not authorized/authenticated.
        // However, since this server-side client uses the ANON key, it's subject to RLS of an anonymous user 
        // UNLESS we pass the user's access token to the client.

        // To properly support RLS in API routes, we need to create a client with the user's token:
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Create a scoped client for this user
        const { createClient } = require('@supabase/supabase-js');
        const userSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data, error } = await userSupabase
            .from('adyam_tracking')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
