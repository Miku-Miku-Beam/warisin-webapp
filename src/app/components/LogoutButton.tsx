"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Call logout API endpoint
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to home page after successful logout
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed:', await response.text());
        // Fallback: clear cookie manually and redirect
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Fallback: clear cookie manually and redirect
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`font-medium py-2 px-4 rounded-lg transition text-sm ${
        isLoading 
          ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
          : 'bg-red-500 hover:bg-red-600 text-white'
      }`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
