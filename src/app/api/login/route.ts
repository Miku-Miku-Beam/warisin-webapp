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

    const { role } = await request.json();


    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const existingUser = await prisma.user.findUnique({
            where: { authId: uid }
        });

        if (existingUser) {
            // skip
            return Response.json({ message: 'User already exists', user: existingUser, status: 200 });
        }

        // Create a new user with the provided role
        const newUser = await prisma.user.create({
            data: {
                authId: uid,
                role: role || 'TALENT',
            },
        });

        (await cookies()).set('session', newUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });


        const response = Response.json({ message: 'User created successfully', user: newUser, status: 201 });
        return response;
    } catch (error) {
        console.error('Error verifying ID token:', error);
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
}