import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const awb = searchParams.get('awb');

    if (!id && !awb) {
        return NextResponse.json({ error: 'Missing id or awb parameter' }, { status: 400 });
    }

    let query = supabase.from('adyam_tracking').select('*');

    if (id) query = query.eq('id', id);
    else if (awb) query = query.eq('awb_no', awb);

    const { data, error } = await query.single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data });
}
