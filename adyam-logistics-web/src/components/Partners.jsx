import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Plane, Ship, Award, TrendingUp } from 'lucide-react';

const Partners = () => {
    const partners = [
        { name: 'FedEx', icon: Plane, color: 'from-purple-500 to-indigo-500' },
        { name: 'DHL', icon: Package, color: 'from-yellow-500 to-orange-500' },
        { name: 'ICL Express', icon: Truck, color: 'from-blue-500 to-cyan-500' },
        { name: 'United Express', icon: Ship, color: 'from-emerald-500 to-teal-500' },
        { name: 'Courier Wala', icon: Truck, color: 'from-pink-500 to-rose-500' },
        { name: 'Atlantic', icon: Ship, color: 'from-indigo-500 to-purple-500' },
        { name: 'PXC Pacific', icon: Plane, color: 'from-teal-500 to-cyan-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <section id="partners" className="relative py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6"
                    >
                        <Award className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold text-gray-300">Trusted Partners</span>
                    </motion.div>

                    <h2 className="text-5xl lg:text-6xl font-black mb-6">
                        <span className="text-white">Powered by </span>
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Industry Leaders
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Partnering with the world's most reliable courier services to deliver excellence
                    </p>
                </motion.div>

                {/* Partners Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16"
                >
                    {partners.map((partner, index) => {
                        const Icon = partner.icon;
                        return (
                            <motion.div
                                key={partner.name}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="glass-dark rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all h-full flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden">
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className={`relative p-4 rounded-xl bg-gradient-to-br ${partner.color} shadow-lg`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />

                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    </motion.div>

                                    {/* Partner Name */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all">
                                        {partner.name}
                                    </h3>

                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">Active</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="glass-dark rounded-3xl p-8 lg:p-12 border border-white/10"
                >
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                99.9%
                            </div>
                            <div className="text-gray-400 font-medium">Delivery Success Rate</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                                24/7
                            </div>
                            <div className="text-gray-400 font-medium">Real-Time Tracking</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                150+
                            </div>
                            <div className="text-gray-400 font-medium">Countries Covered</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Partners;
