// MOCK AI SERVICE
// Provides realistic simulation without API Keys for demo purposes

const MOCK_DELAY = 1500; // Simulated network delay

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeQuery(query, databaseType = 'postgresql') {
    await sleep(MOCK_DELAY);

    const q = query.toLowerCase();

    // Logic for simulation
    let category = 'FAST';
    let execTime = '0.05s';
    let rows = 50;
    const issues = [];
    const suggestions = [];

    if (q.includes('join')) {
        category = 'HEAVY';
        execTime = '1.2s';
        rows = 15000;
        issues.push({
            type: 'PERFORMANCE',
            severity: 'high',
            description: 'Unoptimized JOIN operation detected. Potential Cartesian product if foreign keys are missing.'
        });
        suggestions.push({
            suggestion: 'Ensure columns used in JOIN conditions are indexed.',
            impact: 'high'
        });
    } else if (q.includes('select *')) {
        category = 'MODERATE';
        execTime = '0.4s';
        rows = 5000;
        issues.push({
            type: 'Bad Practice',
            severity: 'medium',
            description: 'SELECT * retrieves all columns, which increases I/O load.'
        });
        suggestions.push({
            suggestion: 'Specify only the required columns (e.g., SELECT id, name FROM ...).',
            impact: 'medium'
        });
    }

    if (!q.includes('where') && !q.includes('limit')) {
        issues.push({
            type: 'SCALABILITY',
            severity: 'high',
            description: 'Unbounded query detected. No WHERE or LIMIT clause found.'
        });
        suggestions.push({
            suggestion: 'Add a LIMIT clause to prevent fetching the entire table.',
            impact: 'high'
        });
    }

    return {
        workload_category: category,
        estimated_execution_time: execTime,
        estimated_rows_scanned: rows,
        detected_issues: issues.length ? issues : [{ type: 'INFO', severity: 'low', description: 'Query looks simple.' }],
        optimization_suggestions: suggestions.length ? suggestions : [{ suggestion: 'Consider using an EXPLAIN ANALYZE to verify.', impact: 'low' }],
        index_suggestions: ["idx_users_email", "idx_orders_created_at"],
        optimized_query: q.replace('select *', 'SELECT id, name, status').replace('where', 'WHERE') + ' LIMIT 100',
        explanation: "Simulated analysis: This query was evaluated based on static patterns. In a real environment, statistics would be pulled from the database metadata.",
        performance_comparison: {
            original_cost: 100,
            optimized_cost: 25,
            improvement_percent: 75
        }
    };
}

export async function chatWithAI(history, userMessage) {
    await sleep(MOCK_DELAY);
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "Hello! I am the QuerySense AI Assistant (Simulation Mode). I can help you optimize your SQL queries. Paste a query to get started!";
    }
    if (lowerMsg.includes('optimize') || lowerMsg.includes('slow')) {
        return "To optimize a slow query, check for missing indexes on columns used in WHERE, JOIN, and ORDER BY clauses. Also, avoid SELECT * and expensive functions like wildcard % at the start of LIKE patterns.";
    }
    if (lowerMsg.includes('index')) {
        return "Indexes speed up data retrieval but slow down writes. Use B-Tree indexes for equality/range checks and Hash indexes for strict equality. Don't over-index!";
    }
    if (lowerMsg.includes('join')) {
        return "When using JOINs, always join on indexed columns (usually Foreign Keys). Prefer INNER JOIN over OUTER JOIN where possible to reduce the result set early.";
    }

    return "That's an interesting database question! Since I am running in Simulation Mode, I can mainly give general advice on Indexes, Performance, and Query Structure. Try asking about 'optimization' or 'joins'.";
}
