import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Clear the session cookie
        const cookieStore = await cookies();
        cookieStore.delete('session');

        return Response.json({ 
            message: 'Logged out successfully',
            status: 200 
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return Response.json({ 
            error: 'Internal server error during logout',
            status: 500 
        }, { status: 500 });
    }
}
