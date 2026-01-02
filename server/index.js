import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';
import { analyzeQuery } from './ai.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
let db;
try {
    db = await initializeDatabase();
    console.log('Database initialized');
} catch (error) {
    console.error('Failed to initialize database:', error);
}

// Routes
app.get('/', (req, res) => {
    res.send('QuerySense Backend is running! Use the frontend to interact with the API.');
});
app.post('/api/analyze', async (req, res) => {
    const { query, database_type } = req.body;
    console.log(`[${new Date().toLocaleTimeString()}] Analysis started for: ${query.substring(0, 30)}...`);
    const startTime = Date.now();

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const analysis = await analyzeQuery(query, database_type);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[${new Date().toLocaleTimeString()}] Analysis completed in ${duration}s`);
        res.json(analysis);
    } catch (error) {
        console.error('AI Analysis failed:', error);
        res.status(500).json({ error: 'Failed to analyze query' });
    }
});

app.post('/api/analyses', async (req, res) => {
    const data = req.body;
    try {
        const result = await db.run(
            `INSERT INTO query_analyses (
        query_text, database_type, workload_category, 
        estimated_execution_time, estimated_rows_scanned, 
        detected_issues, optimization_suggestions, 
        index_suggestions, optimized_query, explanation,
        performance_comparison, created_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.query_text,
                data.database_type,
                data.workload_category,
                data.estimated_execution_time,
                data.estimated_rows_scanned,
                JSON.stringify(data.detected_issues),
                JSON.stringify(data.optimization_suggestions),
                JSON.stringify(data.index_suggestions),
                data.optimized_query,
                data.explanation,
                JSON.stringify(data.performance_comparison),
                new Date().toISOString()
            ]
        );
        res.status(201).json({ id: result.lastID, ...data });
    } catch (error) {
        console.error('Failed to save analysis:', error);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

app.get('/api/analyses', async (req, res) => {
    try {
        const analyses = await db.all('SELECT * FROM query_analyses ORDER BY created_date DESC');
        // Parse JSON strings back to arrays/objects
        const parsedAnalyses = analyses.map(row => ({
            ...row,
            detected_issues: JSON.parse(row.detected_issues || '[]'),
            optimization_suggestions: JSON.parse(row.optimization_suggestions || '[]'),
            index_suggestions: JSON.parse(row.index_suggestions || '[]'),
            performance_comparison: JSON.parse(row.performance_comparison || '{}'),
        }));
        res.json(parsedAnalyses);
    } catch (error) {
        console.error('Failed to fetch analyses:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.get('/api/analyses/:id', async (req, res) => {
    try {
        const analysis = await db.get('SELECT * FROM query_analyses WHERE id = ?', [req.params.id]);
        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }
        res.json({
            ...analysis,
            detected_issues: JSON.parse(analysis.detected_issues || '[]'),
            optimization_suggestions: JSON.parse(analysis.optimization_suggestions || '[]'),
            index_suggestions: JSON.parse(analysis.index_suggestions || '[]'),
            performance_comparison: JSON.parse(analysis.performance_comparison || '{}'),
        });
    } catch (error) {
        console.error('Failed to fetch analysis:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
