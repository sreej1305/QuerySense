import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CreditCard,
    Lock,
    ArrowLeft,
    Check,
    Shield,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LabelRoot = ({ children, className }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

export default function Payment() {
    const location = useLocation();
    const planName = location.state?.plan || 'Pro';
    const planPrice = location.state?.price || '$29';

    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleInputChange = (field, value) => {
        let formattedValue = value;

        if (field === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
        } else if (field === 'expiry') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})/, '$1/').slice(0, 5);
        } else if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData({ ...formData, [field]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsComplete(true);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen py-12 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full mx-auto px-4"
                >
                    <Card className="bg-slate-900/50 border-slate-800 text-center">
                        <CardContent className="pt-12 pb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6"
                            >
                                <Check className="w-10 h-10 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                            <p className="text-slate-400 mb-8">
                                Welcome to QuerySense AI {planName}. Your account has been upgraded.
                            </p>
                            <div className="space-y-3">
                                <Link to={createPageUrl('Analyze')}>
                                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                        Start Analyzing
                                    </Button>
                                </Link>
                                <Link to={createPageUrl('Home')}>
                                    <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to={createPageUrl('Pricing')}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pricing
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-cyan-400" />
                                    Payment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <LabelRoot>Cardholder Name</LabelRoot>
                                        <Input
                                            placeholder="John Doe"
                                            className="bg-slate-800 border-slate-700"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <LabelRoot>Card Number</LabelRoot>
                                        <Input
                                            placeholder="0000 0000 0000 0000"
                                            className="bg-slate-800 border-slate-700"
                                            required
                                            value={formData.cardNumber}
                                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <LabelRoot>Expiry Date</LabelRoot>
                                            <Input
                                                placeholder="MM/YY"
                                                className="bg-slate-800 border-slate-700"
                                                required
                                                value={formData.expiry}
                                                onChange={(e) => handleInputChange('expiry', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <LabelRoot>CVV</LabelRoot>
                                            <Input
                                                placeholder="123"
                                                className="bg-slate-800 border-slate-700"
                                                required
                                                value={formData.cvv}
                                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white h-12"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay ${planPrice}`
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Plan Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                    <div>
                                        <h3 className="font-semibold text-white">QuerySense {planName}</h3>
                                        <p className="text-sm text-slate-400">Monthly subscription</p>
                                    </div>
                                    <div className="text-xl font-bold text-cyan-400">{planPrice}</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Shield className="w-4 h-4 text-emerald-400" />
                                        Secure SSL encrypted payment
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Lock className="w-4 h-4 text-emerald-400" />
                                        Your data is safe and encrypted
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-800">
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total Due</span>
                                        <span className="text-white">{planPrice}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
