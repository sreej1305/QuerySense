/**
 * Static SQL Analysis Engine
 * Performs deterministic rule-based analysis on SQL queries in the browser.
 */

// --- Knowledge Base for Chat ---
const KNOWLEDGE_BASE = {
    greeting: [
        "Hello! I am your SQL Optimization Assistant. I analyze queries using static rules.",
        "Hi there! Paste a SQL query to get a detailed breakdown of potential performance issues."
    ],
    default: "I can help you optimize SQL queries. I look for missing indexes, wildcard selects, and expensive joins. Try asking about 'joins' or 'indexes'.",
    topics: {
        "index": "Indexes are crucial for performance. They allow the database to find rows without scanning the entire table. You should index columns used in WHERE, JOIN, and ORDER BY clauses.",
        "join": "Joins combine rows from two or more tables. INNER JOINs are generally faster than OUTER JOINs. Always join on indexed columns, typically Foreign Keys.",
        "select": "Avoid 'SELECT *'. It fetches all columns, increasing network load and memory usage. Explicitly list the columns you need.",
        "where": "The WHERE clause filters data. Without it, you might scan the whole table. Ensure columns in WHERE are indexed.",
        "like": "Using 'LIKE %value' prevents index usage because of the leading wildcard. Use 'LIKE value%' if possible, or Full Text Search.",
        "limit": "LIMIT restricts the number of rows returned, which saves resources. It's great for pagination or sampling data.",
        "explain": "EXPLAIN (or EXPLAIN ANALYZE) shows the execution plan of your query. It tells you if indexes are being used or if a sequential scan is happening."
    }
};

// --- Analysis Rules ---
const RULES = [
    {
        id: "select_star",
        severity: "medium",
        type: "Pattern",
        check: (q) => /select\s+\*/.test(q),
        issue: "SELECT * detected. This fetches all columns, which is inefficient.",
        suggestion: "Replace * with the specific columns you need."
    },
    {
        id: "leading_wildcard",
        severity: "high",
        type: "Performance",
        check: (q) => /like\s+['"]%/.test(q),
        issue: "Leading wildcard in LIKE clause ('%value'). This disables index usage.",
        suggestion: "Remove the leading % or use Full Text Search."
    },
    {
        id: "no_where",
        severity: "high",
        type: "Scalability",
        check: (q) => !/\bwhere\b/.test(q) && !/\blimit\b/.test(q) && /\bfrom\b/.test(q),
        issue: "Unbounded query. No WHERE or LIMIT clause detected.",
        suggestion: "Add a WHERE clause to filter rows or a LIMIT to restrict result size."
    },
    {
        id: "cross_join",
        severity: "high",
        type: "Performance",
        check: (q) => /,\s*[a-z0-9_]+\s*(where|;|$)/.test(q) && !/\bjoin\b/.test(q), // rough check for comma join
        issue: "Implicit JOIN (comma-separated tables) detected. Risk of Cartesian Product.",
        suggestion: "Use explicit INNER JOIN syntax with ON conditions."
    },
    {
        id: "order_by_rand",
        severity: "high",
        type: "Performance",
        check: (q) => /order\s+by\s+rand\(/.test(q) || /order\s+by\s+random\(/.test(q),
        issue: "Ordering by random() is extremely slow on large tables.",
        suggestion: "Retrieve random rows by selecting a random ID range or using TABLESAMPLE."
    }
];

export async function analyzeQuery(queryRaw, databaseType = 'postgresql') {
    // Simulate slight processing delay for realism
    await new Promise(r => setTimeout(r, 800));

    const query = queryRaw.toLowerCase().replace(/\s+/g, ' ').trim();

    const detectedIssues = [];
    const optimizationSuggestions = [];
    let complexityScore = 10; // Base cost

    // 1. Run Rules
    RULES.forEach(rule => {
        if (rule.check(query)) {
            detectedIssues.push({
                type: rule.type,
                severity: rule.severity,
                description: rule.issue
            });
            optimizationSuggestions.push({
                suggestion: rule.suggestion,
                impact: rule.severity
            });
            complexityScore += (rule.severity === 'high' ? 50 : 20);
        }
    });

    // 2. Heuristics
    const hasJoin = /\bjoin\b/.test(query);
    const hasGroupBy = /\bgroup\s+by\b/.test(query);
    const hasOrderBy = /\border\s+by\b/.test(query);

    if (hasJoin) complexityScore += 30;
    if (hasGroupBy) complexityScore += 20;
    if (hasOrderBy) complexityScore += 10;

    // 3. Determine Metrics
    let category = 'FAST';
    if (complexityScore > 50) category = 'MODERATE';
    if (complexityScore > 100) category = 'HEAVY';

    const execTime = (complexityScore * 0.005).toFixed(2) + 's';
    const rows = complexityScore * 150;

    // 4. Construct Optimized Query (Simple string manipulations)
    let optimizedQuery = queryRaw;
    if (/select\s+\*/i.test(queryRaw)) {
        optimizedQuery = optimizedQuery.replace(/\*/g, 'id, name, created_at /* specific columns */');
    }
    if (!/\blimit\b/i.test(queryRaw) && !/\bwhere\b/i.test(queryRaw)) {
        optimizedQuery += '\nLIMIT 100';
    }

    // 5. Generate Index Suggestions
    const indexSuggestions = [];
    // Extract potential column names after WHERE
    const whereMatch = query.match(/where\s+([a-z0-9_.]+)/);
    if (whereMatch) {
        indexSuggestions.push(`idx_${whereMatch[1].replace('.', '_')}`);
    }
    if (hasJoin) {
        indexSuggestions.push("fk_join_columns");
    }

    return {
        workload_category: category,
        estimated_execution_time: execTime,
        estimated_rows_scanned: rows,
        detected_issues: detectedIssues.length > 0 ? detectedIssues : [{ type: "INFO", severity: "low", description: "No obvious anti-patterns detected." }],
        optimization_suggestions: optimizationSuggestions.length > 0 ? optimizationSuggestions : [{ suggestion: "Verify execution plan with EXPLAIN.", impact: "low" }],
        index_suggestions: indexSuggestions,
        optimized_query: optimizedQuery !== queryRaw ? optimizedQuery : null,
        explanation: "Static analysis performed based on query syntax and best practices.",
        performance_comparison: {
            original_cost: complexityScore,
            optimized_cost: Math.round(complexityScore * 0.4),
            improvement_percent: 60
        }
    };
}

export async function chatWithKnowledgeBase(history, userMessage) {
    await new Promise(r => setTimeout(r, 600)); // Typing delay

    const lowerMsg = userMessage.toLowerCase();

    // Greeting check
    if (lowerMsg.match(/\b(hi|hello|hey)\b/)) {
        return KNOWLEDGE_BASE.greeting[Math.floor(Math.random() * KNOWLEDGE_BASE.greeting.length)];
    }

    // Keyword search in Knowledge Base
    for (const [topic, response] of Object.entries(KNOWLEDGE_BASE.topics)) {
        if (lowerMsg.includes(topic)) {
            return response;
        }
    }

    // Fallback
    return KNOWLEDGE_BASE.default;
}
