"use client"
import { clientAuth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export default function Home() {
    const provider = new GoogleAuthProvider();

    async function signInWithGoogle() {
        try {
            const userCredential = await signInWithPopup(clientAuth, provider);
            console.log('User signed in:', userCredential.user.uid);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userCredential.user.uid}`
                },
                body: JSON.stringify({
                    role: 'ARTISAN'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User logged in successfully:', data);
            } else {
                console.log(response)
                throw new Error('Error logging in');
            }
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <div className="flex flex-col items-center gap-4">

                <button
                    onClick={signInWithGoogle}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Sign In with Google
                </button>
            </div>
        </div>
    );
}
