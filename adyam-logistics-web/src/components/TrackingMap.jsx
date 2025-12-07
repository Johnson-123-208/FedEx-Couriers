import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import { Maximize2, Minimize2, Search, X, MapPin, Package, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

const TrackingMap = () => {
    const globeEl = useRef();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchAWB, setSearchAWB] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [arcsData, setArcsData] = useState([]);
    const [pointsData, setPointsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const couriers = [
        'FedEx',
        'ICL Express',
        'United Express',
        'Courier Wala',
        'Atlantic Courier',
        'DHL Express'
    ];

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.3;
            globeEl.current.controls().enableZoom = true;
        }
    }, []);

    const handleSearch = async () => {
        if (!searchAWB) {
            setError('Please enter an AWB number');
            return;
        }

        if (!selectedCourier) {
            setError('Please select a courier service');
            return;
        }

        setLoading(true);
        setError('');
        setSelectedShipment(null);
        setArcsData([]);
        setPointsData([]);

        try {
            const response = await fetch('http://localhost:5000/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    awb: searchAWB,
                    service: selectedCourier
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const found = data.data;
                setSelectedShipment(found);

                const arcs = [];
                const points = [];

                const routePath = found.route && found.route.length > 1 ? found.route : [found.origin, found.currentLocation || found.destination];

                for (let i = 0; i < routePath.length - 1; i++) {
                    arcs.push({
                        startLat: routePath[i].lat,
                        startLng: routePath[i].lng,
                        endLat: routePath[i + 1].lat,
                        endLng: routePath[i + 1].lng,
                        color: found.status.toLowerCase().includes('delivered') ? ['#10b981', '#34d399'] : ['#3b82f6', '#60a5fa'],
                        shipment: found
                    });
                }

                routePath.forEach((loc, index) => {
                    const isLast = index === routePath.length - 1;
                    const isFirst = index === 0;

                    points.push({
                        lat: loc.lat,
                        lng: loc.lng,
                        size: isLast ? 0.6 : (isFirst ? 0.4 : 0.3),
                        color: isLast ? '#f59e0b' : (isFirst ? '#3b82f6' : '#06b6d4'),
                        label: isLast ? `${found.id} - ${loc.name}` : loc.name,
                        date: loc.date,
                        activity: loc.activity
                    });
                });

                setArcsData(arcs);
                setPointsData(points);

                if (globeEl.current) {
                    const targetLat = found.currentLocation?.lat || found.destination.lat;
                    const targetLng = found.currentLocation?.lng || found.destination.lng;

                    globeEl.current.pointOfView({
                        lat: targetLat,
                        lng: targetLng,
                        altitude: 1.8
                    }, 1500);
                }
            } else {
                setError(data.error || 'Shipment not found. Please verify your tracking details.');
            }
        } catch (err) {
            console.error("Failed to fetch tracking data:", err);
            setError('Unable to connect to tracking server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.getElementById('globe-container').requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const getStatusColor = (status) => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) return 'from-emerald-500 to-green-600';
        if (s.includes('out for delivery')) return 'from-blue-500 to-cyan-600';
        if (s.includes('transit')) return 'from-amber-500 to-orange-600';
        return 'from-slate-500 to-gray-600';
    };

    const getStatusIcon = (status) => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) return <CheckCircle2 className="w-5 h-5" />;
        if (s.includes('transit')) return <TrendingUp className="w-5 h-5" />;
        return <Package className="w-5 h-5" />;
    };

    return (
        <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-2xl" />
            </div>

            <div className="container mx-auto relative z-10 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                            Real-Time Tracking
                        </span>
                    </motion.div>

                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
                            Global Shipment
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Intelligence
                        </span>
                    </h1>

                    <p className="text-slate-400 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                        Track your packages across the globe with precision and elegance
                    </p>
                </motion.div>

                {/* Search Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-5xl mx-auto mb-12"
                >
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                        <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Courier Selector */}
                                <div className="lg:w-1/3 relative group/select">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300" />
                                    <select
                                        value={selectedCourier}
                                        onChange={(e) => setSelectedCourier(e.target.value)}
                                        className="relative w-full h-16 bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 text-white text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-500/30 backdrop-blur-sm"
                                    >
                                        <option value="" className="bg-slate-900">Select Courier</option>
                                        {couriers.map(c => (
                                            <option key={c} value={c} className="bg-slate-900">{c}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* AWB Input */}
                                <div className="flex-1 relative group/input">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300" />
                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={searchAWB}
                                            onChange={(e) => setSearchAWB(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Enter AWB Number"
                                            className="w-full h-16 bg-slate-800/50 border border-slate-600/50 rounded-xl pl-16 pr-6 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-500/30 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Track Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="lg:w-auto px-10 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Tracking...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5" />
                                                Track Shipment
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Globe Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    id="globe-container"
                    className={`relative ${isFullscreen ? 'h-screen' : 'h-[800px]'} rounded-3xl overflow-hidden shadow-2xl`}
                >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-20 blur-xl" />

                    <div className="relative h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
                        {/* Fullscreen Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleFullscreen}
                            className="absolute top-6 right-6 z-50 p-4 bg-slate-800/80 backdrop-blur-md border border-slate-600/50 rounded-xl hover:bg-slate-700/80 transition-all duration-300 shadow-lg group"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                            ) : (
                                <Maximize2 className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                            )}
                        </motion.button>

                        {/* Globe */}
                        <Globe
                            ref={globeEl}
                            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                            arcsData={arcsData}
                            arcColor={'color'}
                            arcDashLength={0.4}
                            arcDashGap={0.2}
                            arcDashAnimateTime={4000}
                            arcStroke={0.6}

                            pointsData={pointsData}
                            pointAltitude={0.08}
                            pointColor={'color'}
                            pointRadius={'size'}
                            pointLabel={'label'}
                            pointResolution={32}

                            atmosphereColor="#3b82f6"
                            atmosphereAltitude={0.25}

                            width={isFullscreen ? window.innerWidth : undefined}
                            height={isFullscreen ? window.innerHeight : 800}
                        />

                        {/* Shipment Details Panel */}
                        <AnimatePresence>
                            {selectedShipment && (
                                <motion.div
                                    initial={{ x: -400, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -400, opacity: 0 }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className="absolute left-6 top-6 w-[420px] max-h-[calc(100%-3rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl z-40"
                                >
                                    {/* Header */}
                                    <div className="sticky top-0 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 rounded-t-2xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="w-5 h-5 text-blue-400" />
                                                    <span className="text-slate-400 text-sm font-medium">Tracking ID</span>
                                                </div>
                                                <h3 className="text-3xl font-bold text-white tracking-tight">{selectedShipment.id}</h3>
                                                <p className="text-cyan-400 text-sm font-semibold mt-1">{selectedShipment.service}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedShipment(null)}
                                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5 text-slate-400 hover:text-white" />
                                            </motion.button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getStatusColor(selectedShipment.status)} shadow-lg`}>
                                            {getStatusIcon(selectedShipment.status)}
                                            <span className="text-white font-bold text-sm">{selectedShipment.status}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Current Location */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                                <MapPin className="w-4 h-4" />
                                                Current Location
                                            </div>
                                            <p className="text-white text-lg font-semibold pl-6">{selectedShipment.location}</p>
                                        </div>

                                        {/* Route Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Origin</p>
                                                <p className="text-white font-semibold text-sm">{selectedShipment.origin.name}</p>
                                            </div>
                                            <div className="space-y-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Destination</p>
                                                <p className="text-white font-semibold text-sm">{selectedShipment.destination.name}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 text-sm font-medium">Delivery Progress</span>
                                                <span className="text-cyan-400 font-bold text-lg">{selectedShipment.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/50"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${selectedShipment.progress}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>

                                        {/* Estimated Delivery */}
                                        {selectedShipment.estimatedDelivery && (
                                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                                                <Clock className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <p className="text-slate-400 text-xs font-medium">Estimated Delivery</p>
                                                    <p className="text-white font-semibold">{selectedShipment.estimatedDelivery}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Journey Stops */}
                                        {selectedShipment.route && selectedShipment.route.length > 2 && (
                                            <div className="space-y-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-slate-300 text-sm font-medium">Journey Stops</span>
                                                </div>
                                                <p className="text-cyan-400 font-bold text-2xl pl-6">
                                                    {selectedShipment.route.length} <span className="text-slate-400 text-sm font-normal">locations tracked</span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Additional Info */}
                                        {selectedShipment.consignee_name && (
                                            <div className="pt-4 border-t border-slate-700/50 space-y-2">
                                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Consignee</p>
                                                <p className="text-white font-semibold">{selectedShipment.consignee_name}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrackingMap;
