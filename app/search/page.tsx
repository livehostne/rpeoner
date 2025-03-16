'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { TMDB_CONFIG, EMBED_CONFIG, getImageUrl } from '../config/tmdb';
import Loading from '../components/Loading';
import EmbedInfo from '../components/EmbedInfo';
import { useSearchParams } from 'next/navigation';

interface SearchResult {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: string;
    first_air_date?: string;
    release_date?: string;
    vote_average: number;
}

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [movies, setMovies] = useState<SearchResult[]>([]);
    const [series, setSeries] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState<SearchResult | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setMovies([]);
                setSeries([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${TMDB_CONFIG.baseURL}/search/multi`, {
                    params: {
                        api_key: TMDB_CONFIG.apiKey,
                        language: TMDB_CONFIG.language,
                        query: query,
                        page: 1
                    }
                });

                // Separar resultados em filmes e séries
                const filteredResults = response.data.results.filter(
                    (item: SearchResult) => item.media_type === 'movie' || item.media_type === 'tv'
                );

                // Buscar detalhes adicionais para cada resultado
                const detailedResults = await Promise.all(
                    filteredResults.map(async (result: SearchResult) => {
                        const endpoint = result.media_type === 'movie' ? 'movie' : 'tv';
                        try {
                            const response = await axios.get(`${TMDB_CONFIG.baseURL}/${endpoint}/${result.id}`, {
                                params: {
                                    api_key: TMDB_CONFIG.apiKey,
                                    language: TMDB_CONFIG.language
                                }
                            });
                            return { ...response.data, media_type: result.media_type };
                        } catch (error) {
                            console.error(`Erro ao buscar detalhes para ${endpoint} ${result.id}:`, error);
                            return result;
                        }
                    })
                );

                // Separar os resultados em filmes e séries
                setMovies(detailedResults.filter(item => item.media_type === 'movie'));
                setSeries(detailedResults.filter(item => item.media_type === 'tv'));
            } catch (error) {
                console.error('Erro ao buscar resultados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const getEmbedUrl = (content: SearchResult) => {
        if (content.media_type === 'movie') {
            return EMBED_CONFIG.movie(content.id);
        } else {
            return EMBED_CONFIG.series(content.id, 1, 1);
        }
    };

    const handleContentClick = (result: SearchResult) => {
        if (result.media_type === 'tv') {
            router.push(`/series?id=${result.id}`);
        } else {
            setSelectedContent(result);
        }
    };

    const ResultGrid = ({ items, title }: { items: SearchResult[], title: string }) => (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map((result) => (
                    <div
                        key={result.id}
                        className="relative group cursor-pointer transition-transform duration-300 transform hover:scale-105"
                        onClick={() => handleContentClick(result)}
                    >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                            <img
                                src={getImageUrl(result.poster_path) || '/placeholder.jpg'}
                                alt={result.title || result.name}
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
                            <h3 className="text-sm font-medium text-gray-200 truncate">
                                {result.title || result.name}
                            </h3>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                <span className="text-yellow-400 mr-2">★ {result.vote_average.toFixed(1)}</span>
                                <span>
                                    {new Date(result.release_date || result.first_air_date || '').getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) return <Loading />;

    return (
        <main className="min-h-screen bg-black text-white pt-20">
            {selectedContent && selectedContent.media_type === 'movie' && (
                <EmbedInfo
                    title={selectedContent.title || selectedContent.name || ''}
                    embedUrl={getEmbedUrl(selectedContent)}
                    onClose={() => setSelectedContent(null)}
                />
            )}
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Resultados para: {query}</h1>
                </div>

                {movies.length === 0 && series.length === 0 ? (
                    <p className="text-center text-gray-400">Nenhum resultado encontrado.</p>
                ) : (
                    <>
                        {movies.length > 0 && <ResultGrid items={movies} title="Filmes" />}
                        {series.length > 0 && <ResultGrid items={series} title="Séries" />}
                    </>
                )}
            </div>
        </main>
    );
} 