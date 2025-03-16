'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TMDB_CONFIG, EMBED_CONFIG, getImageUrl } from '../config/tmdb';
import { TMDBMovie } from '../types/tmdb';
import Loading from '../components/Loading';
import EmbedInfo from '../components/EmbedInfo';

export default function MoviesPage() {
    const [movies, setMovies] = useState<TMDBMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${TMDB_CONFIG.baseURL}/movie/popular`, {
                    params: {
                        api_key: TMDB_CONFIG.apiKey,
                        language: TMDB_CONFIG.language,
                        page: 1
                    }
                });
                setMovies(response.data.results);
            } catch (error) {
                console.error('Erro ao carregar filmes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <Loading />;

    return (
        <main className="min-h-screen bg-black text-white pt-20">
            {selectedMovie && (
                <EmbedInfo
                    title={selectedMovie.title}
                    embedUrl={EMBED_CONFIG.movie(selectedMovie.id)}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Filmes</h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative group cursor-pointer transition-transform duration-300 transform hover:scale-105"
                            onClick={() => setSelectedMovie(movie)}
                        >
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                                <img
                                    src={getImageUrl(movie.poster_path) || '/placeholder.jpg'}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="bg-white bg-opacity-30 rounded-full p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-sm font-medium text-gray-200 truncate">{movie.title}</h3>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <span className="text-yellow-400 mr-2">★ {movie.vote_average.toFixed(1)}</span>
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
} 