import { App, cert, getApps, initializeApp } from "firebase-admin/app";

// Validate required environment variables
const requiredEnvVars = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

// Debug logging
console.log('Firebase Config Check:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ Set' : '✗ Missing');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✓ Set' : '✗ Missing');

// Check if all required variables are present
const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingVars.length > 0) {
    console.warn(`⚠️ Firebase Admin SDK disabled - Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Add these to your .env.local file to enable Firebase features');
}

// Initialize Firebase Admin App
let adminApp: App | null = null;

try {
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
        adminApp = existingApps[0];
        console.log('✓ Using existing Firebase Admin app');
    } else if (missingVars.length === 0) {
        // Only initialize if all environment variables are present
        adminApp = initializeApp({
            credential: cert({
                projectId: requiredEnvVars.projectId!,
                clientEmail: requiredEnvVars.clientEmail!,
                privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, '\n'),
            }),
        });
        console.log('✓ Firebase Admin app initialized successfully');
    } else {
        console.log('⚠️ Firebase Admin app not initialized - missing environment variables');
    }
} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    adminApp = null;
}

// Helper function to check if Firebase is available
export const isFirebaseAvailable = (): boolean => {
    return adminApp !== null;
};

// Helper function to get adminApp safely
export const getAdminApp = (): App => {
    if (!adminApp) {
        throw new Error('Firebase Admin is not initialized. Please check your environment variables.');
    }
    return adminApp;
};

export { adminApp };
