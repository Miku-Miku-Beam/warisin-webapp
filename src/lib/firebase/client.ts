import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const getFirebaseConfig = () => {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Validasi menggunakan nilai dari firebaseConfig
    const missingKeys = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (missingKeys.length > 0) {
        console.error('🔥 Firebase Client Configuration Error');
        console.error('Missing configuration values:', missingKeys);
        throw new Error(`Firebase client configuration incomplete. Missing: ${missingKeys.join(', ')}`);
    }

    return firebaseConfig;
};

export const firebaseConfig = getFirebaseConfig();

let app;
try {
    app = initializeApp(firebaseConfig)
    console.log('✓ Firebase client initialized successfully');
} catch (error) {
    console.error('❌ Firebase client initialization failed:', error);
    throw error;
}

const clientAuth = getAuth(app);
export { app, clientAuth };

