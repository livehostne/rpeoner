interface ContentIds {
    movies: number[];
    series: number[];
}

async function fetchContentIds(): Promise<ContentIds> {
    try {
        // Usa a URL base do ambiente ou localhost como fallback
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/content`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar IDs:', error);
        return { movies: [], series: [] };
    }
}

// IDs dos filmes e séries disponíveis
// Estes arrays podem ser atualizados manualmente conforme necessário

export const AVAILABLE_CONTENT = {
    movies: [] as number[],
    series: [] as number[]
};

// Carrega os IDs assim que o módulo é importado
fetchContentIds().then(data => {
    AVAILABLE_CONTENT.movies = data.movies;
    AVAILABLE_CONTENT.series = data.series;
}); 