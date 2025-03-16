import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-red-500 border-t-transparent"></div>
      </div>
    </div>
  );
} 