import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Database,
    Zap,
    Copy,
    Check,
    Loader2,
    AlertTriangle,
    Lightbulb,
    Clock,
    Rows3,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Analyze() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [dbType, setDbType] = useState('postgresql');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const sampleQueries = [
        {
            label: 'SELECT * with no WHERE',
            query: 'SELECT * FROM users'
        },
        {
            label: 'Missing index opportunity',
            query: 'SELECT * FROM orders WHERE customer_id = 123 AND status = "pending" ORDER BY created_at DESC'
        },
        {
            label: 'Complex JOIN query',
            query: `SELECT u.name, o.total, p.name as product
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.created_at > '2024-01-01'`
        }
    ];

    const analyzeQuery = async () => {
        if (!query.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        const analysisPrompt = `Analyze this SQL query and provide optimization recommendations:

SQL Query:
${query}

Database Type: ${dbType}

Provide a JSON response with the following structure:
{
  "workload_category": "FAST" | "MODERATE" | "HEAVY",
  "estimated_execution_time": "string (e.g., '<10ms', '100-500ms', '>1s')",
  "estimated_rows_scanned": number,
  "detected_issues": [
    {
      "type": "string (e.g., 'SELECT_ALL', 'MISSING_WHERE', 'FULL_TABLE_SCAN', 'N_PLUS_ONE', 'MISSING_INDEX')",
      "description": "string describing the issue",
      "severity": "low" | "medium" | "high"
    }
  ],
  "optimization_suggestions": [
    {
      "suggestion": "string describing the optimization",
      "impact": "string describing expected improvement",
      "priority": "low" | "medium" | "high"
    }
  ],
  "index_suggestions": [
    {
      "table": "string",
      "columns": ["column1", "column2"],
      "type": "BTREE" | "HASH" | "GIN" | "GIST"
    }
  ],
  "optimized_query": "string with the optimized SQL query",
  "explanation": "string with plain-English explanation of all optimizations made"
}

Be thorough in analyzing:
- SELECT * usage (suggest specific columns)
- Missing WHERE clauses
- JOIN efficiency and types
- Potential missing indexes
- ORDER BY without indexes
- Subquery optimization opportunities
- N+1 query patterns`;

        const response = await base44.integrations.Core.InvokeLLM({
            query: query,
            database_type: dbType
        });

        // Show result immediately to the user
        setResult(response);
        setIsAnalyzing(false);

        // Save to database in the background (asynchronous)
        base44.entities.QueryAnalysis.create({
            query_text: query,
            database_type: dbType,
            workload_category: response.workload_category,
            estimated_execution_time: response.estimated_execution_time,
            estimated_rows_scanned: response.estimated_rows_scanned,
            detected_issues: response.detected_issues,
            optimization_suggestions: response.optimization_suggestions,
            index_suggestions: response.index_suggestions,
            optimized_query: response.optimized_query,
            explanation: response.explanation,
            performance_comparison: {
                original_cost: 100,
                optimized_cost: response.workload_category === 'FAST' ? 20 : response.workload_category === 'MODERATE' ? 50 : 80,
                improvement_percent: response.workload_category === 'FAST' ? 80 : response.workload_category === 'MODERATE' ? 50 : 20
            }
        }).then((savedAnalysis) => {
            // Update the result with the actual ID once saved, so "View Details" works
            setResult(prev => ({ ...prev, id: savedAnalysis.id }));
        }).catch((err) => {
            console.error("Background save failed:", err);
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getWorkloadBadgeClass = (category) => {
        switch (category) {
            case 'FAST':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'MODERATE':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'HEAVY':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'medium':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'low':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        SQL Query Analyzer
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Paste your query below and get instant optimization recommendations
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Database className="w-5 h-5 text-cyan-400" />
                                    Query Input
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Database Type</label>
                                    <Select value={dbType} onValueChange={setDbType}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                            <SelectItem value="mysql">MySQL</SelectItem>
                                            <SelectItem value="sqlite">SQLite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">SQL Query</label>
                                    <Textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="SELECT * FROM users WHERE..."
                                        className="min-h-[200px] bg-slate-800 border-slate-700 text-white font-mono text-sm placeholder:text-slate-600"
                                    />
                                </div>

                                <Button
                                    onClick={analyzeQuery}
                                    disabled={isAnalyzing || !query.trim()}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white h-12"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Analyze Query
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Sample Queries */}
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base">Try a sample query</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {sampleQueries.map((sample, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuery(sample.query)}
                                        className="w-full text-left px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all text-sm text-slate-400 hover:text-white"
                                    >
                                        {sample.label}
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Section */}
                    <div>
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex items-center justify-center"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-slate-400">Analyzing your query...</p>
                                    </div>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Workload Summary */}
                                    <Card className="bg-slate-900/50 border-slate-800">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <Badge className={`${getWorkloadBadgeClass(result.workload_category)} px-4 py-2 text-lg font-semibold border`}>
                                                    {result.workload_category}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate(createPageUrl(`QueryDetail?id=${result.id}`))}
                                                    className="border-slate-700 text-slate-400 hover:text-white"
                                                >
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-800/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                                        <Clock className="w-4 h-4" />
                                                        Est. Execution Time
                                                    </div>
                                                    <div className="text-xl font-semibold text-white">
                                                        {result.estimated_execution_time}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-800/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                                        <Rows3 className="w-4 h-4" />
                                                        Est. Rows Scanned
                                                    </div>
                                                    <div className="text-xl font-semibold text-white">
                                                        {result.estimated_rows_scanned?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Detected Issues */}
                                    {result.detected_issues?.length > 0 && (
                                        <Card className="bg-slate-900/50 border-slate-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-white flex items-center gap-2 text-base">
                                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                    Detected Issues ({result.detected_issues.length})
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {result.detected_issues.map((issue, index) => (
                                                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                                                        <Badge className={`${getSeverityClass(issue.severity)} text-xs border shrink-0`}>
                                                            {issue.severity}
                                                        </Badge>
                                                        <div>
                                                            <div className="text-white text-sm font-medium">{issue.type.replace(/_/g, ' ')}</div>
                                                            <div className="text-slate-400 text-sm mt-1">{issue.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Optimization Suggestions */}
                                    {result.optimization_suggestions?.length > 0 && (
                                        <Card className="bg-slate-900/50 border-slate-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-white flex items-center gap-2 text-base">
                                                    <Lightbulb className="w-5 h-5 text-cyan-400" />
                                                    Optimization Suggestions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {result.optimization_suggestions.map((suggestion, index) => (
                                                    <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                                                        <div className="text-white text-sm">{suggestion.suggestion}</div>
                                                        <div className="text-cyan-400 text-xs mt-2">Impact: {suggestion.impact}</div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Optimized Query */}
                                    {result.optimized_query && (
                                        <Card className="bg-slate-900/50 border-slate-800">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-white flex items-center gap-2 text-base">
                                                        <Zap className="w-5 h-5 text-emerald-400" />
                                                        Optimized Query
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(result.optimized_query)}
                                                        className="text-slate-400 hover:text-white"
                                                    >
                                                        {copied ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <pre className="bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm text-emerald-400 font-mono whitespace-pre-wrap">
                                                    {result.optimized_query}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex items-center justify-center"
                                >
                                    <div className="text-center p-12 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30">
                                        <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-500">Enter a SQL query to see analysis results</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
