export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    original_language: string;
}

export interface TMDBSeries {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    first_air_date: string;
    vote_average: number;
    genre_ids: number[];
    original_language: string;
}

export interface TMDBSeason {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string;
    overview: string;
}

export interface TMDBEpisode {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    season_number: number;
    still_path: string;
    air_date: string;
}

export interface TMDBGenre {
    id: number;
    name: string;
} 