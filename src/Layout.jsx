import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
    Database,
    BarChart3,
    History,
    Sparkles,
    CreditCard,
    Menu,
    X,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Chatbot from './components/Chatbot';

export default function Layout({ children, currentPageName }) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const navItems = [
        { name: 'Home', page: 'Home', icon: Zap },
        { name: 'Analyze', page: 'Analyze', icon: Database },
        { name: 'History', page: 'History', icon: History },
        { name: 'Insights', page: 'Insights', icon: BarChart3 },
        { name: 'Pricing', page: 'Pricing', icon: CreditCard },
        { name: 'Contact', page: 'Contact', icon: Menu },
    ];

    const isLanding = currentPageName === 'Home';

    return (
        <div className="min-h-screen bg-slate-950">
            <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 199 89% 48%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 199 89% 48%;
        }
        body {
          background: #020617;
          color: #f8fafc;
        }
      `}</style>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-white tracking-tight">QuerySense AI</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.page}
                                    to={createPageUrl(item.page)}
                                    className={`px-4 py-2 rounded-lg text-xl font-medium transition-all ${currentPageName === item.page
                                        ? 'bg-slate-800 text-cyan-400'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to={createPageUrl('Analyze')}>
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                                    Start Analyzing
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="text-slate-400">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-slate-900 border-slate-800 w-72">
                                <div className="flex flex-col gap-2 mt-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.page}
                                            to={createPageUrl(item.page)}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentPageName === item.page
                                                ? 'bg-slate-800 text-cyan-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="mt-4 pt-4 border-t border-slate-800">
                                        <Link to={createPageUrl('Analyze')} onClick={() => setMobileOpen(false)}>
                                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                                Start Analyzing
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24">
                {children}
            </main>

            {/* Footer */}
            {!isLanding && (
                <footer className="border-t border-slate-800/50 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-slate-400">QuerySense AI © 2025</span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
                                <span className="hover:text-slate-300 cursor-pointer">Terms</span>
                                <span className="hover:text-slate-300 cursor-pointer">Support</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
            <Chatbot />
        </div>
    );
}
