import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Lightbulb, Zap, Clock, Rows3 } from 'lucide-react';

export default function QueryDetail() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const { data: analysis, isLoading } = useQuery({
        queryKey: ['query-analysis', id],
        queryFn: () => base44.entities.QueryAnalysis.get(id),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (!analysis) {
        return <div className="text-white text-center py-20">Analysis not found</div>;
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Query Details</h1>

            <div className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Original Query</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
                            {analysis.query_text}
                        </pre>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="pt-6">
                            <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Execution Time
                            </div>
                            <div className="text-2xl font-bold text-white">{analysis.estimated_execution_time}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="pt-6">
                            <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                                <Rows3 className="w-4 h-4" /> Rows Scanned
                            </div>
                            <div className="text-2xl font-bold text-white">{analysis.estimated_rows_scanned?.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                {analysis.detected_issues?.length > 0 && (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-400" /> Detected Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {analysis.detected_issues.map((issue, idx) => (
                                <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                                    <div className="font-medium text-white">{issue.type}</div>
                                    <div className="text-slate-400 text-sm mt-1">{issue.description}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {analysis.optimized_query && (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-emerald-400" /> Optimized Query
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-800 p-4 rounded-lg text-sm text-emerald-400 font-mono whitespace-pre-wrap overflow-x-auto">
                                {analysis.optimized_query}
                            </pre>
                            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Explanation
                                </div>
                                <p className="text-slate-300 text-sm">{analysis.explanation}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
