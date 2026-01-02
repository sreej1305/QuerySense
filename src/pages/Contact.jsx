import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MessageSquare,
    Send,
    Loader2,
    Check,
    MapPin,
    Phone,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setIsSuccess(false), 5000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@querysense.ai',
            description: 'Our team typically responds within 2 hours.'
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+1 (555) 123-4567',
            description: 'Available Mon-Fri, 9am - 6pm EST.'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            value: '123 Cloud St, Silicon Valley, CA',
            description: 'Headquarters and engineering hub.'
        }
    ];

    const faqs = [
        {
            q: 'How quickly can I get help?',
            a: 'We offer 24/7 monitoring for Enterprise clients and 2-hour response times during business hours for Pro users.'
        },
        {
            q: 'Do you offer custom training?',
            a: 'Yes, we provide tailored AI model training for Enterprise clients to better understand their specific database schemas and query patterns.'
        },
        {
            q: 'Can I request a feature?',
            a: 'Absolutely! Most of our best features come from user feedback. Send us a message with your idea!'
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 border mb-4">
                        Contact
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Have questions about QuerySense? Our team is here to help you optimize your SQL workflow.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {/* Contact Methods */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-900/50 border-slate-800">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                                                <info.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{info.title}</h3>
                                                <p className="text-cyan-400 text-sm font-medium mb-1">{info.value}</p>
                                                <p className="text-slate-500 text-xs">{info.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-slate-900/50 border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                                    Send us a message
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Your Name</label>
                                            <Input
                                                placeholder="John Doe"
                                                className="bg-slate-800 border-slate-700 text-slate-200"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Work Email</label>
                                            <Input
                                                type="email"
                                                placeholder="john@company.com"
                                                className="bg-slate-800 border-slate-700 text-slate-200"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Subject</label>
                                        <Input
                                            placeholder="Pricing inquiry, feature request, etc."
                                            className="bg-slate-800 border-slate-700 text-slate-200"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Message</label>
                                        <Textarea
                                            placeholder="Tell us more about how we can help..."
                                            className="bg-slate-800 border-slate-700 text-slate-200 min-h-[150px]"
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <AnimatePresence mode="wait">
                                            {isSuccess ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="w-full p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2"
                                                >
                                                    <Check className="w-5 h-5" />
                                                    Message sent successfully! We'll get back to you soon.
                                                </motion.div>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white h-12"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Preview */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
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
