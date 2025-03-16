'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-red-600 text-2xl font-bold">
                            ATLAS
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-white hover:text-red-500 transition-colors">
                                Início
                            </Link>
                            <Link href="/filmes" className="text-white hover:text-red-500 transition-colors">
                                Filmes
                            </Link>
                            <Link href="/series" className="text-white hover:text-red-500 transition-colors">
                                Séries
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="search"
                                placeholder="Buscar filmes e séries..."
                                className="w-64 px-4 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
} 