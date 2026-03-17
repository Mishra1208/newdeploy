import { NextResponse } from 'next/server';
import { addSeatAlert } from '@/lib/firebase/firestore';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, term, subject, courseNumber, classNumber } = body;

        // Validation
        if (!email || !term || !subject || !courseNumber || !classNumber) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' }, 
                { status: 400 }
            );
        }

        // Add to database
        const result = await addSeatAlert({
            email,
            term,
            subject,
            courseNumber,
            classNumber
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.message }, 
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, id: result.id });
    } catch (error) {
        console.error('Seat alert subscription error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error while subscribing' }, 
            { status: 500 }
        );
    }
}
