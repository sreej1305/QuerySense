import { analyzeQuery } from '../lib/analysisEngine';

// Helper to manage local storage
const STORAGE_KEY = 'query_sense_analyses';
const getStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};
const setStorage = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const base44 = {
    integrations: {
        Core: {
            InvokeLLM: async ({ query, database_type }) => {
                // Direct call to client-side Gemini lib
                return await analyzeQuery(query, database_type);
            }
        }
    },
    entities: {
        QueryAnalysis: {
            create: async (data) => {
                const analyses = getStorage();
                const newId = analyses.length > 0 ? Math.max(...analyses.map(a => a.id)) + 1 : 1;

                const newAnalysis = {
                    id: newId,
                    ...data,
                    created_date: new Date().toISOString()
                };

                analyses.unshift(newAnalysis); // Add to beginning
                setStorage(analyses);

                return newAnalysis;
            },
            list: async () => {
                return getStorage();
            },
            get: async (id) => {
                const analyses = getStorage();
                const analysis = analyses.find(a => a.id === parseInt(id));
                if (!analysis) throw new Error('Analysis not found');
                return analysis;
            }
        }
    }
};
