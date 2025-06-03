"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (_error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-screen relative">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <Image 
            src="/doro.webp" 
            alt="Forgot Password" 
            className="object-cover w-full h-full" 
            width={500} 
            height={500} 
            layout="responsive" 
          />
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
            </h1>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'We have sent a password reset link to your email address.'
                : 'Enter your email address and we&apos;ll send you a link to reset your password.'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-2 border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                If an account exists with {email}, you will receive an email with instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
