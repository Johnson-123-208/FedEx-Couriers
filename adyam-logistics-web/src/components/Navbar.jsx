import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Menu, X, Sparkles, TrendingUp, Shield, Globe2 } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const navItems = [
        { label: 'Home', id: 'hero', icon: Sparkles },
        { label: 'Track', id: 'tracking-section', icon: Package },
        { label: 'Services', id: 'partners', icon: Globe2 },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                        ? 'glass-dark border-b border-white/10 shadow-2xl backdrop-blur-2xl'
                        : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => scrollToSection('hero')}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-black text-white leading-none">ADYAM</h1>
                                <p className="text-xs text-indigo-400 font-medium tracking-wider">LOGISTICS</p>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => scrollToSection(item.id)}
                                        className="px-5 py-2.5 rounded-xl text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2 group"
                                    >
                                        <Icon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                        <span>{item.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection('tracking-section')}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Track Now
                                </span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl glass border border-white/10 text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 right-0 z-40 md:hidden"
                    >
                        <div className="glass-dark border-b border-white/10 shadow-2xl backdrop-blur-2xl m-4 rounded-2xl overflow-hidden">
                            <div className="p-4 space-y-2">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => scrollToSection(item.id)}
                                            className="w-full px-5 py-3 rounded-xl text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-3 group"
                                        >
                                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span>{item.label}</span>
                                        </motion.button>
                                    );
                                })}

                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navItems.length * 0.1 }}
                                    onClick={() => scrollToSection('tracking-section')}
                                    className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg mt-2 flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Track Now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from going under navbar */}
            <div className="h-20" />
        </>
    );
};

export default Navbar;
