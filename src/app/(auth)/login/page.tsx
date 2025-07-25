"use client"
import { clientAuth } from "@/lib/firebase/client";
import { ROLE } from "@/lib/static";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const provider = new GoogleAuthProvider();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithGoogle() {
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(clientAuth, provider);
            console.log('User signed in with Google:', userCredential.user.uid);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify({
                    role: ROLE.APPLICANT, // Default role for login
                    provider: 'google'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User logged in successfully:', data);
                window.location.href = '/';
            } else {
                console.log(response);
                throw new Error('Error logging in');
            }
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            
            // Handle specific Firebase errors
            let errorMessage = 'An error occurred while signing in';
            if (error.code) {
                switch (error.code) {
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your internet connection and Firebase configuration.';
                        break;
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Sign-in was cancelled.';
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
                        break;
                    case 'auth/cancelled-popup-request':
                        errorMessage = 'Another sign-in process is already in progress.';
                        break;
                    default:
                        errorMessage = `Authentication error: ${error.message}`;
                }
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleEmailLogin() {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            // Sign in existing user
            const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
            console.log('User signed in:', userCredential.user.uid);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify({
                    role: ROLE.APPLICANT,
                    provider: 'email',
                    isNewUser: false
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User logged in successfully:', data);
                window.location.href = '/';
            } else {
                console.log(response);
                throw new Error('Error logging in');
            }
        } catch (error: any) {
            console.error('Error with email login:', error);
            
            // Handle specific Firebase errors
            let errorMessage = 'An error occurred while signing in';
            if (error.code) {
                switch (error.code) {
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email address.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password. Please try again.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address format.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = `Authentication error: ${error.message}`;
                }
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="font-sans flex justify-center items-center min-h-screen p-8">
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center">Sign In</h1>

                {/* Email/Password Form */}
                <div className="w-full space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleEmailLogin}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>

                {/* Divider */}
                <div className="w-full flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Google Sign In */}
                <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Signing In...' : 'Sign in with Google'}
                </button>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 

