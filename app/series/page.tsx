'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { TMDB_CONFIG, EMBED_CONFIG, getImageUrl, fetchInBatches } from '../config/tmdb';
import { TMDBSeries } from '../types/tmdb';
import Loading from '../components/Loading';
import EmbedInfo from '../components/EmbedInfo';
import { AVAILABLE_CONTENT } from '../config/available-content';

export default function SeriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const seriesId = id || '';

    const [series, setSeries] = useState<TMDBSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeries, setSelectedSeries] = useState<TMDBSeries | null>(null);
    const [seasons, setSeasons] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [selectedEpisode, setSelectedEpisode] = useState<{
        seasonNumber: number;
        episodeNumber: number;
        name: string;
        seriesName: string;
        seriesId: number;
    } | null>(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                setLoading(true);
                if (id) {
                    // Buscar detalhes da série específica
                    const response = await axios.get(`${TMDB_CONFIG.baseURL}/tv/${id}`, {
                        params: {
                            api_key: TMDB_CONFIG.apiKey,
                            language: TMDB_CONFIG.language,
                        }
                    });
                    setSelectedSeries(response.data);
                    setSeasons(response.data.seasons || []);
                    if (response.data.seasons && response.data.seasons.length > 0) {
                        setSelectedSeason(1);
                    }
                } else {
                    // Buscar séries populares
                    const response = await axios.get(`${TMDB_CONFIG.baseURL}/tv/popular`, {
                        params: {
                            api_key: TMDB_CONFIG.apiKey,
                            language: TMDB_CONFIG.language,
                            page: 1
                        }
                    });
                    setSeries(response.data.results);
                }
            } catch (error) {
                console.error('Erro ao carregar séries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeries();
    }, [id]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (selectedSeries && selectedSeason !== null) {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `${TMDB_CONFIG.baseURL}/tv/${selectedSeries.id}/season/${selectedSeason}`,
                        {
                            params: {
                                api_key: TMDB_CONFIG.apiKey,
                                language: TMDB_CONFIG.language,
                            }
                        }
                    );
                    setEpisodes(response.data.episodes || []);
                } catch (error) {
                    console.error('Erro ao carregar episódios:', error);
                    setEpisodes([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchEpisodes();
    }, [selectedSeries, selectedSeason]);

    if (loading) return <Loading />;

    if (selectedSeries) {
        return (
            <main className="min-h-screen bg-black text-white pt-20">
                {selectedEpisode && (
                    <EmbedInfo
                        title={`${selectedEpisode.seriesName} - Temporada ${selectedEpisode.seasonNumber} Episódio ${selectedEpisode.episodeNumber}`}
                        embedUrl={EMBED_CONFIG.series(
                            selectedEpisode.seriesId,
                            selectedEpisode.seasonNumber,
                            selectedEpisode.episodeNumber
                        )}
                        onClose={() => setSelectedEpisode(null)}
                    />
                )}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster e Informações */}
                        <div className="w-full md:w-1/4">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                                <img
                                    src={getImageUrl(selectedSeries.poster_path) || '/placeholder.jpg'}
                                    alt={selectedSeries.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="mt-4">
                                <h1 className="text-2xl font-bold">{selectedSeries.name}</h1>
                                <div className="flex items-center text-sm text-gray-400 mt-2">
                                    <span className="text-yellow-400 mr-2">★ {selectedSeries.vote_average.toFixed(1)}</span>
                                    <span>{new Date(selectedSeries.first_air_date).getFullYear()}</span>
                                </div>
                                <p className="mt-4 text-gray-300">{selectedSeries.overview}</p>
                            </div>
                        </div>

                        {/* Temporadas e Episódios */}
                        <div className="w-full md:w-3/4">
                            <div className="flex gap-2 overflow-x-auto pb-4">
                                {seasons.map((season) => (
                                    <button
                                        key={season.season_number}
                                        onClick={() => setSelectedSeason(season.season_number)}
                                        className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                                            selectedSeason === season.season_number
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Temporada {season.season_number}
                                    </button>
                                ))}
                            </div>

                            <div className="grid gap-4 mt-4">
                                {episodes.map((episode) => (
                                    <div
                                        key={episode.episode_number}
                                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                                        onClick={() => setSelectedEpisode({
                                            seasonNumber: selectedSeason!,
                                            episodeNumber: episode.episode_number,
                                            name: episode.name,
                                            seriesName: selectedSeries.name,
                                            seriesId: selectedSeries.id
                                        })}
                                    >
                                        <div className="flex items-center gap-4">
                                            {episode.still_path && (
                                                <img
                                                    src={getImageUrl(episode.still_path)}
                                                    alt={episode.name}
                                                    className="w-40 h-24 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-medium">
                                                    Episódio {episode.episode_number}: {episode.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1">{episode.overview}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Séries</h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {series.map((show) => (
                        <div
                            key={show.id}
                            className="relative group cursor-pointer transition-transform duration-300 transform hover:scale-105"
                            onClick={() => router.push(`/series?id=${show.id}`)}
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
                                    <span className="text-yellow-400 mr-2">★ {show.vote_average.toFixed(1)}</span>
                                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
} 