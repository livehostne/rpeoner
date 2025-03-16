import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function readIdsFromFile(filename: string): number[] {
    try {
        const filePath = path.join(process.cwd(), 'data', filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        return content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(Number)
            .filter(id => !isNaN(id));
    } catch (error) {
        console.error(`Erro ao ler ${filename}:`, error);
        return [];
    }
}

export async function GET() {
    const movies = readIdsFromFile('movies.txt');
    const series = readIdsFromFile('series.txt');

    return NextResponse.json({ movies, series });
} 