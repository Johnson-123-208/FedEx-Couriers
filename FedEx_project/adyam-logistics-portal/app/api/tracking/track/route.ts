// Single tracking endpoint

import { NextResponse } from 'next/server';
import { trackShipment } from '@/lib/tracking';

export async function POST(request: Request) {
    try {
        const { awb, provider } = await request.json();

        if (!awb) {
            return NextResponse.json(
                { error: 'AWB number is required' },
                { status: 400 }
            );
        }

        const result = await trackShipment(awb, provider);

        return NextResponse.json({ result });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
