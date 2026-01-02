import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    History as HistoryIcon,
    Database,
    Clock,
    ChevronRight,
    Loader2,
    FileText,
    ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function History() {
    const { data: analyses, isLoading } = useQuery({
        queryKey: ['query-analyses'],
        queryFn: () => base44.entities.QueryAnalysis.list('-created_date', 50)
    });

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

    const getDbIcon = (dbType) => {
        return (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dbType === 'postgresql' ? 'bg-blue-500/10 text-blue-400' :
                    dbType === 'mysql' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-slate-500/10 text-slate-400'
                }`}>
                <Database className="w-4 h-4" />
            </div>
        );
    };

    const truncateQuery = (query, maxLength = 60) => {
        if (!query) return '';
        return query.length > maxLength ? query.substring(0, maxLength) + '...' : query;
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <HistoryIcon className="w-8 h-8 text-cyan-400" />
                            Query History
                        </h1>
                        <p className="text-slate-400">
                            View and manage your analyzed queries
                        </p>
                    </div>
                    <Link to={createPageUrl('Analyze')}>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                            New Analysis
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                ) : !analyses || analyses.length === 0 ? (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="py-16 text-center">
                            <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No queries analyzed yet</h3>
                            <p className="text-slate-400 mb-6">Start by analyzing your first SQL query</p>
                            <Link to={createPageUrl('Analyze')}>
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                    Analyze Query
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Query</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Database</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Workload</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Timestamp</th>
                                        <th className="text-right px-6 py-4 text-sm font-medium text-slate-400"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyses.map((analysis, index) => (
                                        <motion.tr
                                            key={analysis.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                                            onClick={() => window.location.href = createPageUrl(`QueryDetail?id=${analysis.id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {getDbIcon(analysis.database_type)}
                                                    <code className="text-sm text-slate-300 font-mono">
                                                        {truncateQuery(analysis.query_text)}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-400 capitalize">
                                                    {analysis.database_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${getWorkloadBadgeClass(analysis.workload_category)} border`}>
                                                    {analysis.workload_category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Clock className="w-4 h-4" />
                                                    {format(new Date(analysis.created_date), 'MMM d, yyyy HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <ChevronRight className="w-5 h-5 text-slate-600 inline" />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
