const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const base44 = {
    integrations: {
        Core: {
            InvokeLLM: async ({ query, database_type }) => {
                const response = await fetch(`${API_URL}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, database_type }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch analysis from AI');
                }

                return await response.json();
            }
        }
    },
    entities: {
        QueryAnalysis: {
            create: async (data) => {
                const response = await fetch(`${API_URL}/analyses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Failed to save analysis');
                }

                return await response.json();
            },
            list: async () => {
                const response = await fetch(`${API_URL}/analyses`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analysis history');
                }
                return await response.json();
            },
            get: async (id) => {
                const response = await fetch(`${API_URL}/analyses/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analysis details');
                }
                return await response.json();
            }
        }
    }
};
