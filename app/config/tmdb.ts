export const TMDB_CONFIG = {
    apiKey: 'eeee41dd5c435331be5827f514fc263a',
    baseURL: 'https://api.themoviedb.org/3',
    imageBaseURL: 'https://image.tmdb.org/t/p',
    language: 'pt-BR'
};

export const EMBED_CONFIG = {
    baseURL: 'https://embed.alphaembeder.com.br',
    movie: (tmdbId: string | number) => `${EMBED_CONFIG.baseURL}/e/${tmdbId}`,
    series: (tmdbId: string | number, season: number, episode: number) => 
        `${EMBED_CONFIG.baseURL}/s/${tmdbId}/${season}/${episode}`
};

// Funções auxiliares para URLs de imagens
export const getImageUrl = (path: string, size: 'original' | 'w500' | 'w780' = 'w500') => {
    if (!path) return null;
    return `${TMDB_CONFIG.imageBaseURL}/${size}${path}`;
};

// Função para fazer requisições em lotes
export async function fetchInBatches<T>(
    ids: number[],
    fetchFn: (id: number) => Promise<T>,
    batchSize: number = 5
): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const batchPromises = batch.map(fetchFn);
        
        try {
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Aguarda 1 segundo entre os lotes para evitar rate limiting
            if (i + batchSize < ids.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('Erro ao buscar lote:', error);
        }
    }
    
    return results;
} 