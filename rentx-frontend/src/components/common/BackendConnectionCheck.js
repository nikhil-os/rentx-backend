'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function BackendConnectionCheck() {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setIsChecking(true);
        // Simple health check to the root API endpoint
        await fetch(process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''), { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        setIsBackendAvailable(true);
      } catch (error) {
        console.error('Backend connection check failed:', error);
        setIsBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkBackendConnection();
    
    // Recheck every 30 seconds
    const intervalId = setInterval(checkBackendConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (isChecking || isBackendAvailable) {
    return null;
  }
  
  return (
    <div className="bg-red-100 text-red-800 px-4 py-3 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">Backend connection error: The server at {process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')} is not reachable.</span>
        </div>
        <a 
          href="#" 
          className="text-red-800 font-medium underline hover:text-red-900"
          onClick={() => window.location.reload()}
        >
          Retry
        </a>
      </div>
    </div>
  );
}