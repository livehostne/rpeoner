'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
    embedUrl: string;
    title: string;
    onClose: () => void;
}

export default function VideoPlayer({ embedUrl, title, onClose }: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [embedUrl]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-bold truncate">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}
                    
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
                    />
                </div>
            </div>
        </div>
    );
} 