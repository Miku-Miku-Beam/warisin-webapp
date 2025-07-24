import { adminAuth } from '@/lib/firebase/admin';
import prisma from '@/lib/prisma';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const headersList = await headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
        return Response.json({ error: 'Authorization header is missing' }, { status: 401 })
    }

    const { role, provider, isNewUser, name } = await request.json();

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        const name = decodedToken.name;
        const picture = decodedToken.picture;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { authId: uid },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true,
            }
        });

        if (existingUser) {
            // User exists, just return user data
            (await cookies()).set('session', JSON.stringify({
                userId: existingUser.id,
                role: existingUser.role,
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // One week
            });

            return Response.json({ 
                message: 'User logged in successfully', 
                user: existingUser, 
                status: 200 
            });
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email: email || '',
                name: name || decodedToken.name || '',
                profileImageUrl: picture || '',
                authId: uid,
                role: role || 'APPLICANT',
            },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true,
            }
        });

        // Set session cookie
        (await cookies()).set('session', newUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // One week
        });

        return Response.json({ 
            message: 'User created and logged in successfully', 
            user: newUser, 
            status: 201 
        });

    } catch (error) {
        console.error('Error verifying ID token:', error);
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
}