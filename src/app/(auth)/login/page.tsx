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
        <div className="flex h-screen">
            {/* Kiri: Gambar */}
            <div className="flex-1 relative hidden md:block">
                <img
                    src="/auth.png" 
                    alt="Wayang Performance"
                    className="object-cover w-full h-full"
                />
            </div>
            {/* Kanan: Form */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
                    {/* Logo */}
                    <img src="/logo-warisin.svg" alt="Warisin Logo" className="w-20 h-20 mb-2" />
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
                            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:from-orange-500 hover:to-yellow-400 transition disabled:opacity-50"
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
                        className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                        >
                        {/* Logo Google berwarna */}
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <g>
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C35.64 2.09 30.18 0 24 0 14.82 0 6.68 5.48 2.69 13.44l8.01 6.23C12.6 13.36 17.85 9.5 24 9.5z"/>
                            <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.41 46.1 31.54 46.1 24.55z"/>
                            <path fill="#FBBC05" d="M10.7 28.07c-.5-1.48-.78-3.06-.78-4.74s.28-3.26.78-4.74l-8.01-6.23C1.01 15.7 0 19.72 0 24s1.01 8.3 2.69 11.64l8.01-6.23z"/>
                            <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.13-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.94 2.15-6.15 0-11.4-3.86-13.3-9.17l-8.01 6.23C6.68 42.52 14.82 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                            </g>
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
        </div>
    );
} 

