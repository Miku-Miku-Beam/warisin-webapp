
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Check if a Firebase Admin app already exists
const existingApps = getApps();
const app = existingApps.length > 0 
    ? existingApps[0] 
    : initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });

const adminAuth = getAuth(app);

export { adminAuth };

