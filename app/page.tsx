'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TMDB_CONFIG, EMBED_CONFIG, getImageUrl } from './config/tmdb';
import { AVAILABLE_CONTENT } from './config/available-content';
import Loading from './components/Loading';
import EmbedInfo from './components/EmbedInfo';

interface Content {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type: 'movie' | 'tv';
}

export default function Home() {
    const [trendingMovies, setTrendingMovies] = useState<Content[]>([]);
    const [trendingSeries, setTrendingSeries] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState<Content | null>(null);
    const [selectedContent, setSelectedContent] = useState<{
        id: number;
        title: string;
        type: 'movie' | 'tv';
        seasonNumber?: number;
        episodeNumber?: number;
    } | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const [moviesResponse, seriesResponse] = await Promise.all([
                    axios.get(`${TMDB_CONFIG.baseURL}/trending/movie/week`, {
                        params: {
                            api_key: TMDB_CONFIG.apiKey,
                            language: TMDB_CONFIG.language
                        }
                    }),
                    axios.get(`${TMDB_CONFIG.baseURL}/trending/tv/week`, {
                        params: {
                            api_key: TMDB_CONFIG.apiKey,
                            language: TMDB_CONFIG.language
                        }
                    })
                ]);

                const movies = moviesResponse.data.results
                    .map((movie: any) => ({
                        ...movie,
                        media_type: 'movie'
                    }))
                    .filter((movie: Content) => AVAILABLE_CONTENT.movies.includes(movie.id));

                const series = seriesResponse.data.results
                    .map((show: any) => ({
                        ...show,
                        media_type: 'tv'
                    }))
                    .filter((show: Content) => AVAILABLE_CONTENT.series.includes(show.id));

                setTrendingMovies(movies);
                setTrendingSeries(series);
                if (movies.length > 0) {
                    setFeaturedMovie(movies[Math.floor(Math.random() * movies.length)]);
                }
            } catch (error) {
                console.error('Erro ao carregar conteúdo:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleContentSelect = (content: Content) => {
        if (content.media_type === 'movie') {
            setSelectedContent({
                id: content.id,
                title: content.title || '',
                type: 'movie'
            });
        } else {
            setSelectedContent({
                id: content.id,
                title: content.name || '',
                type: 'tv',
                seasonNumber: 1,
                episodeNumber: 1
            });
        }
    };

    if (loading) return <Loading />;

    return (
        <main className="min-h-screen bg-black">
            {selectedContent && (
                <EmbedInfo
                    title={selectedContent.title}
                    embedUrl={
                        selectedContent.type === 'movie'
                            ? EMBED_CONFIG.movie(selectedContent.id)
                            : EMBED_CONFIG.series(
                                selectedContent.id,
                                selectedContent.seasonNumber!,
                                selectedContent.episodeNumber!
                            )
                    }
                    onClose={() => setSelectedContent(null)}
                />
            )}

            {/* Banner */}
            {featuredMovie && (
                <div className="relative h-[80vh] w-full">
                    <div className="absolute inset-0">
                        <img
                            src={getImageUrl(featuredMovie.backdrop_path, 'original')}
                            alt={featuredMovie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{featuredMovie.title}</h1>
                        <p className="text-lg text-gray-200 mb-6 max-w-2xl">{featuredMovie.overview}</p>
                        <button
                            onClick={() => handleContentSelect(featuredMovie)}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Assistir Agora
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Filmes em Alta */}
                {trendingMovies.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Filmes em Alta</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {trendingMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="relative group cursor-pointer transition-transform duration-300 transform hover:scale-105"
                                    onClick={() => handleContentSelect(movie)}
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
                                            <span className="text-yellow-400 mr-2">★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Séries em Alta */}
                {trendingSeries.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Séries em Alta</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {trendingSeries.map((show) => (
                                <div
                                    key={show.id}
                                    className="relative group cursor-pointer transition-transform duration-300 transform hover:scale-105"
                                    onClick={() => handleContentSelect(show)}
                                >
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                                        <img
                                            src={getImageUrl(show.poster_path) || '/placeholder.jpg'}
                                            alt={show.name}
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
                                        <h3 className="text-sm font-medium text-gray-200 truncate">{show.name}</h3>
                                        <div className="flex items-center text-xs text-gray-400 mt-1">
                                            <span className="text-yellow-400 mr-2">★ {show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}</span>
                                            <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
