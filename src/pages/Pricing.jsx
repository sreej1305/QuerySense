import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out QuerySense AI',
            icon: Sparkles,
            features: [
                '10 queries per month',
                'Basic optimization suggestions',
                'PostgreSQL support',
                'Query history (7 days)',
                'Community support'
            ],
            cta: 'Get Started',
            popular: false,
            gradient: 'from-slate-500 to-slate-600'
        },
        {
            name: 'Pro',
            price: '$29',
            period: 'per month',
            description: 'For developers and small teams',
            icon: Zap,
            features: [
                'Unlimited queries',
                'Advanced AI optimization',
                'All database types',
                'Unlimited query history',
                'Index recommendations',
                'Performance insights',
                'Priority support',
                'API access'
            ],
            cta: 'Upgrade Now',
            popular: true,
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'contact us',
            description: 'For organizations with advanced needs',
            icon: Building2,
            features: [
                'Everything in Pro',
                'Custom integrations',
                'SSO / SAML',
                'Dedicated support',
                'SLA guarantee',
                'On-premise deployment',
                'Custom AI training',
                'Audit logs'
            ],
            cta: 'Contact Sales',
            popular: false,
            gradient: 'from-violet-500 to-purple-600'
        }
    ];

    const faqs = [
        {
            q: 'Can I cancel my subscription anytime?',
            a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
        },
        {
            q: 'What databases are supported?',
            a: 'We support PostgreSQL, MySQL, and SQLite. Enterprise plans can include additional database support.'
        },
        {
            q: 'Is there a free trial for Pro?',
            a: 'Yes, Pro comes with a 14-day free trial. No credit card required.'
        }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 border mb-4">
                        Pricing
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Choose the plan that fits your needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={plan.popular ? 'md:-mt-4 md:mb-4' : ''}
                        >
                            <Card className={`bg-slate-900/50 border-slate-800 h-full relative ${plan.popular ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : ''
                                }`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 px-4">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                                        <plan.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-slate-500 text-sm">/{plan.period}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-3">{plan.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start gap-3 text-sm text-slate-300">
                                                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={createPageUrl('Payment')} state={{ plan: plan.name, price: plan.price }}>
                                        <Button
                                            className={`w-full ${plan.popular
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                                                    : 'bg-slate-800 hover:bg-slate-700'
                                                } text-white`}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
