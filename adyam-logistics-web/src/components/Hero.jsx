import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Globe from 'react-globe.gl';
import { ArrowRight, Box, ShieldCheck, Zap, Globe2, ChevronRight } from 'lucide-react';

const Hero = () => {
    const globeEl = useRef();
    const [arcsData, setArcsData] = useState([]);

    const scrollToTracking = () => {
        const trackingSection = document.getElementById('tracking-section');
        if (trackingSection) {
            trackingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Generate random arcs for the hero globe to make it alive
    useEffect(() => {
        const N = 20;
        const arcs = [...Array(N).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: [['#3b82f6', '#06b6d4'][Math.round(Math.random())], ['#3b82f6', '#06b6d4'][Math.round(Math.random())]]
        }));
        setArcsData(arcs);

        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.6;
            globeEl.current.controls().enableZoom = false;
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#020617]">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            ADYAM LOGISTICS
                        </motion.div>

                        {/* Company Name & Logo - Unique Vertical Layout */}
                        <div className="mb-10">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white font-black text-2xl">AL</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-3xl font-black text-white tracking-tight leading-none">ADYAM</span>
                                    <span className="text-lg font-light text-cyan-400 tracking-[0.3em] uppercase">Logistics</span>
                                </div>
                            </div>
                        </div>

                        {/* Headline - Unique Staggered Layout */}
                        <div className="mb-8 space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-6xl lg:text-8xl font-black text-white leading-none"
                            >
                                Shipping
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pl-12 lg:pl-20"
                            >
                                <span className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 leading-none">
                                    Reimagined.
                                </span>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg pl-2 border-l-4 border-cyan-500/50"
                        >
                            Experience the future of global trade with real-time 3D tracking, AI-powered route optimization, and instant delivery updates.
                        </motion.p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-16">
                            <motion.button
                                onClick={scrollToTracking}
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 group"
                            >
                                Track Shipment
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-slate-800/30 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 backdrop-blur-sm transition-all"
                            >
                                Contact Sales
                            </motion.button>
                        </div>

                        {/* Stats - Unique Asymmetric Layout (No Border) */}
                        {/* <div className="grid grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="relative"
                            >
                                <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl"></div>
                                <h4 className="text-4xl lg:text-5xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent mb-2">
                                    50K+
                                </h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Deliveries</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="relative mt-6"
                            >
                                <div className="absolute -top-2 -left-2 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl"></div>
                                <h4 className="text-4xl lg:text-5xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent mb-2">
                                    100+
                                </h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Countries</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="relative mt-12"
                            >
                                <div className="absolute -top-2 -left-2 w-12 h-12 bg-teal-500/10 rounded-full blur-xl"></div>
                                <h4 className="text-4xl lg:text-5xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent mb-2">
                                    99%
                                </h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Satisfaction</p>
                            </motion.div>
                        </div> */}
                    </motion.div>

                    {/* Right Content - 3D Globe */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block h-[600px] w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
                        <Globe
                            ref={globeEl}
                            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                            backgroundColor="rgba(0,0,0,0)"
                            arcsData={arcsData}
                            arcColor={'color'}
                            arcDashLength={0.4}
                            arcDashGap={0.2}
                            arcDashAnimateTime={1500}
                            arcStroke={0.5}
                            atmosphereColor="#3b82f6"
                            atmosphereAltitude={0.15}
                            width={600}
                            height={600}
                        />

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 right-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl max-w-[200px]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Secure</p>
                                    <p className="text-slate-400 text-xs">End-to-end</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 left-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl max-w-[200px]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Fast</p>
                                    <p className="text-slate-400 text-xs">Global Delivery</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
