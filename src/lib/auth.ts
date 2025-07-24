import { cookies } from 'next/headers';
import prisma from './prisma';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');
        
        if (!sessionCookie) {
            return null;
        }

        // Try to parse the session cookie
        let sessionData;
        try {
            sessionData = JSON.parse(sessionCookie.value);
        } catch {
            // If parsing fails, treat it as a user ID string (old format)
            sessionData = { userId: sessionCookie.value };
        }

        const userId = sessionData.userId || sessionData;

        if (!userId || typeof userId !== 'string') {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true,
            }
        });

        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function isLoggedIn() {
    const user = await getCurrentUser();
    return !!user;
}

export async function getUserRole() {
    const user = await getCurrentUser();
    return user?.role || null;
}
