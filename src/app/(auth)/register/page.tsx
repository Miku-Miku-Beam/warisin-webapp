"use client"
import { clientAuth } from "@/lib/firebase/client";
import { ROLE } from "@/lib/static";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
    const provider = new GoogleAuthProvider();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState(ROLE.APPLICANT);
    const [loading, setLoading] = useState(false);

    async function signUpWithGoogle() {
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(clientAuth, provider);
            console.log('User signed up with Google:', userCredential.user.uid);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify({
                    role: role,
                    provider: 'google'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User registered successfully:', data);
                // Redirect to getstarted if user is new or not onboarded
                if (data.onboarded === false || data.isNewUser === true) {
                    window.location.href = '/getstarted';
                } else {
                    window.location.href = '/';
                }
            } else {
                console.log(response);
                throw new Error('Error registering user');
            }
        } catch (error) {
            console.error('Error signing up with Google:', error);
            alert(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleEmailSignUp() {
        if (!email || !password || !confirmPassword) {
            alert('Please fill all required fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            // Register new user with Firebase
            const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
            console.log('User registered:', userCredential.user.uid);

            // Send user data to backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify({
                    role: role,
                    provider: 'email',
                    isNewUser: true,
                    name: name
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User registered successfully:', data);
                // Redirect to getstarted if user is new or not onboarded
                if (data.onboarded === false || data.isNewUser === true) {
                    window.location.href = '/getstarted';
                } else {
                    window.location.href = '/';
                }
            } else {
                console.log(response);
                throw new Error('Error registering user');
            }
        } catch (error) {
            console.error('Error with email registration:', error);
            alert(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen">
            {/* Kiri: Gambar */}
            <div className="flex-1 relative hidden md:block">
                <img
                    src="/auth.png" // ganti dengan path gambar kamu
                    alt="Wayang Performance"
                    className="object-cover w-full h-full"
                />
            </div>
            {/* Kanan: Form */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
                    {/* Logo */}
                    <img src="/logo-warisin.svg" alt="Warisin Logo" className="w-20 h-20 mb-2" />
                    <h1 className="text-3xl font-bold text-center">Create Account</h1>

                    {/* Role Selection */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Register as:
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={ROLE.APPLICANT}
                                    checked={role === ROLE.APPLICANT}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mr-2"
                                    disabled={loading}
                                />
                                Applicant
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={ROLE.ARTISAN}
                                    checked={role === ROLE.ARTISAN}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mr-2"
                                    disabled={loading}
                                />
                                Artisan
                            </label>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password (min 6 characters)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password *
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            onClick={handleEmailSignUp}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:from-orange-500 hover:to-yellow-400 transition disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={signUpWithGoogle}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <g>
                                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C35.64 2.09 30.18 0 24 0 14.82 0 6.68 5.48 2.69 13.44l8.01 6.23C12.6 13.36 17.85 9.5 24 9.5z" />
                                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.41 46.1 31.54 46.1 24.55z" />
                                <path fill="#FBBC05" d="M10.7 28.07c-.5-1.48-.78-3.06-.78-4.74s.28-3.26.78-4.74l-8.01-6.23C1.01 15.7 0 19.72 0 24s1.01 8.3 2.69 11.64l8.01-6.23z" />
                                <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.13-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.94 2.15-6.15 0-11.4-3.86-13.3-9.17l-8.01 6.23C6.68 42.52 14.82 48 24 48z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </g>
                        </svg>
                        {loading ? 'Creating Account...' : 'Sign up with Google'}
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}