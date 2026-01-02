import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart3,
    Database,
    AlertTriangle,
    TrendingUp,
    Loader2,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function Insights() {
    const { data: analyses, isLoading } = useQuery({
        queryKey: ['all-analyses'],
        queryFn: () => base44.entities.QueryAnalysis.list('-created_date', 100)
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    const totalQueries = analyses?.length || 0;

    // Calculate workload distribution
    const workloadCounts = {
        FAST: analyses?.filter(a => a.workload_category === 'FAST').length || 0,
        MODERATE: analyses?.filter(a => a.workload_category === 'MODERATE').length || 0,
        HEAVY: analyses?.filter(a => a.workload_category === 'HEAVY').length || 0
    };

    const heavyPercent = totalQueries > 0
        ? Math.round((workloadCounts.HEAVY / totalQueries) * 100)
        : 0;

    const pieData = [
        { name: 'Fast', value: workloadCounts.FAST, color: '#10b981' },
        { name: 'Moderate', value: workloadCounts.MODERATE, color: '#f59e0b' },
        { name: 'Heavy', value: workloadCounts.HEAVY, color: '#ef4444' }
    ].filter(d => d.value > 0);

    // Calculate database distribution
    const dbCounts = analyses?.reduce((acc, a) => {
        acc[a.database_type] = (acc[a.database_type] || 0) + 1;
        return acc;
    }, {}) || {};

    const dbData = Object.entries(dbCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        queries: value
    }));

    // Calculate common issues
    const issueCounts = {};
    analyses?.forEach(a => {
        a.detected_issues?.forEach(issue => {
            const type = issue.type?.replace(/_/g, ' ') || 'Unknown';
            issueCounts[type] = (issueCounts[type] || 0) + 1;
        });
    });

    const issueData = Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    // Average improvement
    const avgImprovement = analyses?.length > 0
        ? Math.round(
            analyses.reduce((sum, a) => sum + (a.performance_comparison?.improvement_percent || 0), 0) / analyses.length
        )
        : 0;

    const stats = [
        {
            label: 'Total Queries Analyzed',
            value: totalQueries.toLocaleString(),
            icon: Database,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
        },
        {
            label: 'Heavy Queries',
            value: `${heavyPercent}%`,
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-500/10'
        },
        {
            label: 'Avg. Improvement',
            value: `${avgImprovement}%`,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Issues Detected',
            value: Object.values(issueCounts).reduce((a, b) => a + b, 0).toLocaleString(),
            icon: BarChart3,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10'
        }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-8">Performance Insights</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-slate-900/50 border-slate-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">{stat.label}</p>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Workload Distribution */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-cyan-400" />
                                Workload Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '#1e293b' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-slate-500">No data available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Database Distribution */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-violet-400" />
                                Databases Used
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            {dbData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dbData}>
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '#1e293b' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="queries" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-slate-500">No data available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Common Issues */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            Most Common Query Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {issueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={issueData} layout="vertical">
                                    <XAxis type="number" stroke="#64748b" hide />
                                    <YAxis dataKey="name" type="category" stroke="#64748b" width={150} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '#1e293b' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-500">No issues detected yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
