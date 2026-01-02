import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import {
    Database,
    Zap,
    History,
    BarChart3,
    ArrowRight,
    Sparkles,
    Shield,
    Clock,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    const features = [
        {
            icon: Database,
            title: 'SQL Workload Analysis',
            description: 'Deep analysis of query patterns, joins, and table scans to identify performance bottlenecks.',
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            icon: Zap,
            title: 'Optimization Recommendations',
            description: 'AI-powered suggestions for query rewrites, index creation, and execution plan improvements.',
            gradient: 'from-violet-500 to-purple-600'
        },
        {
            icon: History,
            title: 'Query History',
            description: 'Track all your analyzed queries with detailed logs and performance trends over time.',
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            icon: BarChart3,
            title: 'Performance Insights',
            description: 'Visual dashboards showing workload distribution, common issues, and optimization impact.',
            gradient: 'from-orange-500 to-red-600'
        }
    ];

    const stats = [
        { value: '10x', label: 'Faster Queries' },
        { value: '85%', label: 'Cost Reduction' },
        { value: '1M+', label: 'Queries Optimized' },
        { value: '99.9%', label: 'Accuracy Rate' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-40 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute top-60 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 mb-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span>Powered by Advanced AI</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Intelligent SQL
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                                Workload Platform
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Analyze, optimize, and monitor your SQL queries with AI-powered insights.
                            Reduce execution time, lower costs, and improve database performance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={createPageUrl('Analyze')}>
                                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 h-12 text-base">
                                    Analyze SQL
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl('Pricing')}>
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 h-12 text-base">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything you need to optimize SQL
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Comprehensive tools for analyzing, optimizing, and monitoring your database queries.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group relative p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                <ChevronRight className="absolute top-8 right-8 w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            How it works
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Three simple steps to optimized queries
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Paste Your Query', desc: 'Enter your SQL query and select your database type.' },
                            { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes patterns, identifies issues, and generates optimizations.' },
                            { step: '03', title: 'Get Results', desc: 'Review optimized query, suggestions, and implement improvements.' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="relative text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-12 text-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to optimize your queries?
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                                Start analyzing your SQL queries today and see immediate performance improvements.
                            </p>
                            <Link to={createPageUrl('Analyze')}>
                                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 h-12 text-base">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">QuerySense AI</span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-slate-500">
                            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
                            <span className="hover:text-slate-300 cursor-pointer">Contact</span>
                        </div>
                        <div className="text-sm text-slate-600">
                            © 2025 QuerySense AI. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
