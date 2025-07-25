import { adminAuth } from '@/lib/firebase/admin';
import prisma from '@/lib/prisma';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log("Login API called");
        const headersList = await headers()
        const authHeader = headersList.get('Authorization')

        if (!authHeader) {
            console.error('Login failed: Authorization header is missing')
            return Response.json({ error: 'Authorization header is missing' }, { status: 401 })
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.error('Login failed: Invalid authorization header format')
            return Response.json({ error: 'Invalid authorization header format' }, { status: 401 })
        }

        let requestBody;
        try {
            requestBody = await request.json();
        } catch (error) {
            console.error('Login failed: Invalid JSON in request body:', error)
            return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 })
        }

        const { role, provider, isNewUser, name } = requestBody;
        console.log('Login attempt:', { role, provider, isNewUser, hasName: !!name })

        const idToken = authHeader.split('Bearer ')[1];

        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            const uid = decodedToken.uid;
            const email = decodedToken.email;
            const tokenName = decodedToken.name;
            const picture = decodedToken.picture;

            console.log('Firebase token verified for user:', { uid, email, hasTokenName: !!tokenName })

            // Check if user already exists
            let existingUser;
            try {
                existingUser = await prisma.user.findUnique({
                    where: { authId: uid },
                    include: {
                        ArtisanProfile: true,
                        ApplicantProfile: true,
                    }
                });
            } catch (error) {
                console.error('Database error when finding existing user:', error)
                return Response.json({ error: 'Database error when checking user' }, { status: 500 })
            }

            if (existingUser) {
                console.log('Existing user found:', { userId: existingUser.id, role: existingUser.role })
                
                // User exists, just return user data
                try {
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
                        onboarded: !!existingUser.ApplicantProfile || !!existingUser.ArtisanProfile,
                        isNewUser: false,
                        status: 200 
                    });
                } catch (error) {
                    console.error('Error setting session cookie for existing user:', error)
                    return Response.json({ error: 'Failed to create session' }, { status: 500 })
                }
            }

        // Validate role for new user
        if (role && !['APPLICANT', 'ARTISAN'].includes(role)) {
            console.error('Invalid role provided:', role)
            return Response.json({ error: 'Invalid role. Must be APPLICANT or ARTISAN' }, { status: 400 })
        }            // Create a new user
            const userData = {
                email: email || '',
                name: name || tokenName || '',
                profileImageUrl: picture || '',
                authId: uid,
                role: role || 'APPLICANT',
            };

            console.log('Creating new user with data:', { ...userData, authId: '[HIDDEN]' })

            let newUser;
            try {
                newUser = await prisma.user.create({
                    data: userData,
                    include: {
                        ArtisanProfile: true,
                        ApplicantProfile: true,
                    }
                });
                console.log('New user created successfully:', { userId: newUser.id, role: newUser.role })
            } catch (error: any) {
                console.error('Database error when creating new user:', error)
                
                // Check for specific Prisma errors
                if (error?.code === 'P2002') {
                    return Response.json({ error: 'User with this email or auth ID already exists' }, { status: 409 })
                } else if (error?.code === '22P02') {
                    return Response.json({ error: 'Invalid data format provided' }, { status: 400 })
                } else if (error?.message?.includes('Invalid value for argument `role`')) {
                    return Response.json({ error: 'Invalid role value provided' }, { status: 400 })
                }
                
                return Response.json({ error: 'Failed to create user account' }, { status: 500 })
            }

            // Set session cookie
            try {
                (await cookies()).set('session', JSON.stringify({
                    userId: newUser.id,
                    role: newUser.role,
                }), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7, // One week
                });

                return Response.json({ 
                    message: 'User created and logged in successfully', 
                    user: newUser, 
                    onboarded: false,
                    isNewUser: true,
                    status: 201 
                });
            } catch (error) {
                console.error('Error setting session cookie for new user:', error)
                return Response.json({ error: 'User created but failed to create session' }, { status: 500 })
            }

        } catch (error: any) {
            console.error('Error verifying Firebase ID token:', error);
            
            if (error?.code === 'auth/id-token-expired') {
                return Response.json({ error: 'Token expired. Please sign in again.' }, { status: 401 });
            } else if (error?.code === 'auth/id-token-revoked') {
                return Response.json({ error: 'Token revoked. Please sign in again.' }, { status: 401 });
            } else if (error?.code === 'auth/invalid-id-token') {
                return Response.json({ error: 'Invalid token format' }, { status: 401 });
            }
            
            return Response.json({ error: 'Token verification failed' }, { status: 401 });
        }

    } catch (error) {
        console.error('Unexpected error in login API:', error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}