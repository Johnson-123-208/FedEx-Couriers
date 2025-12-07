import React from 'react';
import { motion } from 'framer-motion';

const collaborators = [
    { name: 'FedEx', emoji: '🚚', color: 'from-purple-600 to-purple-800', description: 'Express Delivery' },
    { name: 'ICL Express', emoji: '✈️', color: 'from-blue-600 to-blue-800', description: 'Air Freight' },
    { name: 'United Express', emoji: '📦', color: 'from-green-600 to-green-800', description: 'Ground Shipping' },
    { name: 'Courier Wala', emoji: '🚛', color: 'from-orange-600 to-orange-800', description: 'Local Delivery' },
    { name: 'Atlantic Courier', emoji: '🌊', color: 'from-cyan-600 to-cyan-800', description: 'Ocean Freight' },
    { name: 'DHL Express', emoji: '⚡', color: 'from-yellow-600 to-red-600', description: 'International' },
];

const Collaborators = () => {
    return (
        <section className="py-32 px-6 bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                        Trusted Partners
                    </h2>
                    <motion.div
                        className="h-1.5 w-32 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Collaborating with industry leaders to deliver
                        <span className="text-cyan-400 font-semibold"> exceptional service worldwide</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {collaborators.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.3 }
                            }}
                            className="relative group cursor-pointer"
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${partner.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

                            {/* Card */}
                            <div className="relative glass-card p-6 flex flex-col items-center justify-center h-40 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden">
                                {/* Animated background */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-20`}
                                    initial={false}
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 100%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />

                                {/* Emoji Icon */}
                                <motion.div
                                    className="text-6xl mb-3 relative z-10"
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    transition={{ duration: 0.6, type: "spring" }}
                                >
                                    {partner.emoji}
                                </motion.div>

                                {/* Name */}
                                <h3 className="text-sm font-bold text-center text-white mb-1 relative z-10 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-cyan-300 transition-all">
                                    {partner.name}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-400 text-center relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {partner.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Partnership Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { value: '6+', label: 'Global Partners' },
                        { value: '150+', label: 'Service Locations' },
                        { value: '24/7', label: 'Support Available' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass-card p-8 text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <h3 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Collaborators;
