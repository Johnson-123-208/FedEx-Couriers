import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import {
    Package, MapPin, Clock, CheckCircle2, TrendingUp, Search, Loader2,
    AlertCircle, X, Sparkles, Navigation, Calendar, User, ArrowRight
} from 'lucide-react';

const TrackingInterface = () => {
    const globeEl = useRef();
    const [searchAWB, setSearchAWB] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [arcsData, setArcsData] = useState([]);
    const [pointsData, setPointsData] = useState([]);
    const [animatingArc, setAnimatingArc] = useState(0);

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
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.controls().enableZoom = true;
        }
    }, []);

    // Animate through route segments
    useEffect(() => {
        if (arcsData.length > 0 && animatingArc < arcsData.length) {
            const timer = setTimeout(() => {
                setAnimatingArc(prev => prev + 1);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [animatingArc, arcsData.length]);

    const handleSearch = async () => {
        if (!searchAWB.trim()) {
            setError('Please enter an AWB number');
            return;
        }

        if (!selectedCourier) {
            setError('Please select a courier service');
            return;
        }

        setLoading(true);
        setError('');
        setTrackingData(null);
        setArcsData([]);
        setPointsData([]);
        setAnimatingArc(0);

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
                setTrackingData(found);

                // Build route from travel history
                const routePath = found.route && found.route.length > 1
                    ? found.route
                    : [found.origin, found.currentLocation || found.destination];

                // Create arcs for animation
                const arcs = [];
                const points = [];

                for (let i = 0; i < routePath.length - 1; i++) {
                    arcs.push({
                        startLat: routePath[i].lat,
                        startLng: routePath[i].lng,
                        endLat: routePath[i + 1].lat,
                        endLng: routePath[i + 1].lng,
                        color: found.status.toLowerCase().includes('delivered')
                            ? ['#10b981', '#34d399']
                            : ['#6366f1', '#ec4899'],
                        shipment: found
                    });
                }

                // Create points for each stop
                routePath.forEach((loc, index) => {
                    const isLast = index === routePath.length - 1;
                    const isFirst = index === 0;

                    points.push({
                        lat: loc.lat,
                        lng: loc.lng,
                        size: isLast ? 0.8 : (isFirst ? 0.6 : 0.4),
                        color: isLast ? '#ec4899' : (isFirst ? '#6366f1' : '#14b8a6'),
                        label: `${loc.name}${loc.date ? '\n' + loc.date : ''}${loc.activity ? '\n' + loc.activity : ''}`,
                        altitude: 0.1
                    });
                });

                setArcsData(arcs);
                setPointsData(points);

                // Focus on the route
                if (globeEl.current && routePath.length > 0) {
                    const centerLat = (routePath[0].lat + routePath[routePath.length - 1].lat) / 2;
                    const centerLng = (routePath[0].lng + routePath[routePath.length - 1].lng) / 2;

                    globeEl.current.pointOfView({
                        lat: centerLat,
                        lng: centerLng,
                        altitude: 2
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

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return 'from-emerald-500 to-teal-500';
        if (s.includes('out for delivery')) return 'from-blue-500 to-cyan-500';
        if (s.includes('transit')) return 'from-amber-500 to-orange-500';
        return 'from-gray-500 to-slate-500';
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return <CheckCircle2 className="w-5 h-5" />;
        if (s.includes('transit')) return <TrendingUp className="w-5 h-5" />;
        return <Package className="w-5 h-5" />;
    };

    return (
        <section id="tracking-section" className="relative min-h-screen py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold text-gray-300">Real-Time Tracking</span>
                    </motion.div>

                    <h2 className="text-5xl lg:text-6xl font-black mb-6">
                        <span className="text-white">Track Your </span>
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Shipment
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Enter your tracking details to view real-time status with 3D route visualization
                    </p>
                </motion.div>

                {/* Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-12"
                >
                    <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
                        <div className="grid md:grid-cols-[200px_1fr_auto] gap-4">
                            <div className="relative">
                                <select
                                    value={selectedCourier}
                                    onChange={(e) => setSelectedCourier(e.target.value)}
                                    className="w-full h-14 glass rounded-xl px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border border-white/10 hover:border-white/20"
                                >
                                    <option value="">Select Courier</option>
                                    {couriers.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchAWB}
                                    onChange={(e) => setSearchAWB(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Enter AWB / Tracking Number"
                                    className="w-full h-14 glass rounded-xl pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border border-white/10 hover:border-white/20"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSearch}
                                disabled={loading}
                                className="h-14 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Tracking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            <span>Track</span>
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 text-sm font-medium">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {!trackingData ? (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center justify-center min-h-[500px]"
                        >
                            <div className="text-center max-w-md">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-indigo-500/30 backdrop-blur-xl"
                                >
                                    <Package className="w-16 h-16 text-indigo-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-3">Ready to Track</h3>
                                <p className="text-gray-400">
                                    Enter your AWB number and select courier service to view real-time tracking with animated 3D route visualization
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        /* Results Layout */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-[450px_1fr] gap-8"
                        >
                            {/* Tracking Details Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Status Card */}
                                <div className="glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                    {/* Header with Status */}
                                    <div className={`bg-gradient-to-r ${getStatusColor(trackingData.status)} p-6`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                                {getStatusIcon(trackingData.status)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white/80 text-sm font-medium mb-1">Status</p>
                                                <h3 className="text-2xl font-black text-white">{trackingData.status}</h3>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80 text-sm font-medium">Progress</span>
                                                <span className="text-white font-bold text-lg">{trackingData.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-xl">
                                                <motion.div
                                                    className="h-full bg-white rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trackingData.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-6 space-y-4">
                                        {/* Tracking ID */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-4 h-4 text-indigo-400" />
                                                <span className="text-gray-400 text-sm font-medium">Tracking ID</span>
                                            </div>
                                            <p className="text-white text-lg font-bold">{trackingData.id}</p>
                                            <p className="text-indigo-400 text-sm font-medium mt-1">{trackingData.service}</p>
                                        </div>

                                        {/* Current Location */}
                                        <div className="p-4 glass rounded-2xl border border-white/10">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-400 text-sm font-medium mb-1">Current Location</p>
                                                    <p className="text-white font-semibold">{trackingData.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Route Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 glass rounded-2xl border border-white/10">
                                                <p className="text-gray-400 text-xs font-medium mb-2">Origin</p>
                                                <p className="text-white font-semibold text-sm">{trackingData.origin?.name || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 glass rounded-2xl border border-white/10">
                                                <p className="text-gray-400 text-xs font-medium mb-2">Destination</p>
                                                <p className="text-white font-semibold text-sm">{trackingData.destination?.name || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Estimated Delivery */}
                                        {trackingData.estimatedDelivery && (
                                            <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                                        <Clock className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-sm font-medium">Est. Delivery</p>
                                                        <p className="text-white font-bold">{trackingData.estimatedDelivery}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Consignee */}
                                        {trackingData.consignee_name && (
                                            <div className="p-4 glass rounded-2xl border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-pink-400" />
                                                    <div>
                                                        <p className="text-gray-400 text-sm font-medium">Consignee</p>
                                                        <p className="text-white font-semibold">{trackingData.consignee_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Travel History */}
                                {trackingData.travel_history && trackingData.travel_history.length > 0 && (
                                    <div className="glass-dark rounded-3xl p-6 border border-white/10 shadow-2xl max-h-[400px] overflow-y-auto custom-scrollbar">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                                            <h3 className="text-white font-bold text-lg">Travel History</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {trackingData.travel_history.map((activity, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="relative pl-6 pb-4 border-l-2 border-indigo-500/30 last:border-l-0 last:pb-0"
                                                >
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-2 border-gray-900" />
                                                    <div className="glass rounded-xl p-3 border border-white/10">
                                                        <p className="text-white font-semibold text-sm mb-1">{activity.activity}</p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                                            <span className="text-gray-400 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {activity.datetime}
                                                            </span>
                                                            <span className="text-indigo-400 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {activity.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Globe Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
                                style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
                            >
                                <Globe
                                    ref={globeEl}
                                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                                    arcsData={arcsData.slice(0, animatingArc)}
                                    arcColor={'color'}
                                    arcDashLength={0.6}
                                    arcDashGap={0.3}
                                    arcDashAnimateTime={2000}
                                    arcStroke={1}

                                    pointsData={pointsData}
                                    pointAltitude={'altitude'}
                                    pointColor={'color'}
                                    pointRadius={'size'}
                                    pointLabel={'label'}
                                    pointResolution={32}

                                    atmosphereColor="#6366f1"
                                    atmosphereAltitude={0.2}

                                    width={undefined}
                                    height={undefined}
                                />

                                {/* Animation Status */}
                                {arcsData.length > 0 && (
                                    <div className="absolute bottom-6 left-6 right-6 glass-dark rounded-2xl p-4 border border-white/10 backdrop-blur-xl">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {animatingArc >= arcsData.length
                                                        ? 'Journey Complete'
                                                        : `Animating route: ${animatingArc + 1} of ${arcsData.length} segments`}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 font-medium">
                                                {pointsData.length} stops
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #6366f1 0%, #ec4899 100%);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #7c3aed 0%, #f472b6 100%);
                }
            `}</style>
        </section>
    );
};

export default TrackingInterface;
