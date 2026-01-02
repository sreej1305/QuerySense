// Mocking base44Client based on usage in the provided code
export const base44 = {
    integrations: {
        Core: {
            InvokeLLM: async ({ prompt, response_json_schema }) => {
                console.log("Mock InvokeLLM called with prompt:", prompt);
                // Simulate a response based on the schema
                return {
                    workload_category: "FAST",
                    estimated_execution_time: "<10ms",
                    estimated_rows_scanned: 150,
                    detected_issues: [
                        {
                            type: "SELECT_ALL",
                            description: "Using SELECT * is generally discouraged. Specify column names for better performance.",
                            severity: "low"
                        }
                    ],
                    optimization_suggestions: [
                        {
                            suggestion: "Specify column names instead of *",
                            impact: "Reduced data transfer",
                            priority: "medium"
                        }
                    ],
                    index_suggestions: [],
                    optimized_query: prompt.match(/SQL Query:\n([\s\S]*)\n\nDatabase Type/)?.[1] || "SELECT id, name FROM users",
                    explanation: "The query was optimized by specifying columns."
                };
            }
        }
    },
    entities: {
        QueryAnalysis: {
            create: async (data) => {
                console.log("Mock QueryAnalysis.create called with data:", data);
                return { ...data, id: Math.random().toString(36).substr(2, 9), created_date: new Date().toISOString() };
            },
            list: async (order, limit) => {
                console.log(`Mock QueryAnalysis.list called with order: ${order}, limit: ${limit}`);
                return [
                    {
                        id: "1",
                        query_text: "SELECT * FROM users",
                        database_type: "postgresql",
                        workload_category: "FAST",
                        created_date: new Date().toISOString()
                    },
                    {
                        id: "2",
                        query_text: "SELECT * FROM orders WHERE status = 'pending'",
                        database_type: "postgresql",
                        workload_category: "MODERATE",
                        created_date: new Date(Date.now() - 86400000).toISOString()
                    }
                ];
            },
            get: async (id) => {
                console.log("Mock QueryAnalysis.get called with id:", id);
                return {
                    id,
                    query_text: "SELECT * FROM users",
                    database_type: "postgresql",
                    workload_category: "FAST",
                    estimated_execution_time: "<10ms",
                    estimated_rows_scanned: 150,
                    detected_issues: [],
                    optimization_suggestions: [],
                    index_suggestions: [],
                    optimized_query: "SELECT id, name FROM users",
                    explanation: "Optimized for demo purposes.",
                    performance_comparison: {
                        original_cost: 100,
                        optimized_cost: 20,
                        improvement_percent: 80
                    },
                    created_date: new Date().toISOString()
                };
            }
        }
    }
};
