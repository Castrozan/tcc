import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
    name: 'movie-db',
    version: '1.0.0'
});

// Mock movie database
const movies = [
    {
        id: 1,
        title: 'The Matrix',
        year: 1999,
        genre: 'sci-fi',
        rating: 8.7,
        director: 'Wachowski Sisters',
        plot: 'A computer programmer discovers that reality is a simulation created by machines.'
    },
    {
        id: 2,
        title: 'Inception',
        year: 2010,
        genre: 'sci-fi',
        rating: 8.8,
        director: 'Christopher Nolan',
        plot: "A thief who enters people's dreams to steal secrets is offered a chance to regain his old life."
    },
    {
        id: 3,
        title: 'The Godfather',
        year: 1972,
        genre: 'drama',
        rating: 9.2,
        director: 'Francis Ford Coppola',
        plot: 'The aging patriarch of an organized crime dynasty transfers control to his son.'
    }
];

// MCP Tools
server.tool(
    'search-movies',
    'Search for movies by title or genre',
    {
        query: z.string().describe('Search term (title or genre)'),
        type: z.enum(['title', 'genre']).describe('Search by title or genre')
    },
    async ({ query, type }) => {
        const results = movies.filter((movie) => {
            if (type === 'title') {
                return movie.title.toLowerCase().includes(query.toLowerCase());
            } else {
                return movie.genre.toLowerCase() === query.toLowerCase();
            }
        });

        if (results.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `No movies found for ${type}: "${query}"`
                    }
                ]
            };
        }

        const formattedResults = results
            .map(
                (movie) =>
                    `Title: ${movie.title} (${movie.year})\nGenre: ${movie.genre}\nRating: ${movie.rating}\nDirector: ${movie.director}\nPlot: ${movie.plot}\n---`
            )
            .join('\n');

        return {
            content: [
                {
                    type: 'text',
                    text: formattedResults
                }
            ]
        };
    }
);

server.tool(
    'get-recommendations',
    'Get movie recommendations based on genre and minimum rating',
    {
        genre: z.string().describe('Preferred genre'),
        minRating: z.number().min(0).max(10).describe('Minimum rating (0-10)')
    },
    async ({ genre, minRating }) => {
        const recommendations = movies.filter(
            (movie) =>
                movie.genre.toLowerCase() === genre.toLowerCase() && movie.rating >= minRating
        );

        if (recommendations.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `No ${genre} movies found with rating >= ${minRating}`
                    }
                ]
            };
        }

        const formattedRecommendations = recommendations
            .sort((a, b) => b.rating - a.rating)
            .map(
                (movie) =>
                    `Recommended: ${movie.title}\nRating: ${movie.rating}\nYear: ${movie.year}\nPlot: ${movie.plot}\n---`
            )
            .join('\n');

        return {
            content: [
                {
                    type: 'text',
                    text: formattedRecommendations
                }
            ]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Movie Database MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
