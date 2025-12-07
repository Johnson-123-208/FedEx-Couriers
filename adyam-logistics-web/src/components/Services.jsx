
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Package, Plane, Ship, Truck, Globe, Clock, Shield, Zap } from 'lucide-react';

const services = [
    {
        icon: Plane,
        title: 'Air Freight',
        description: 'Lightning-fast air cargo services for time-critical shipments worldwide.',
        color: 'from-blue-600 to-cyan-600',
        delay: 0
    },
    {
        icon: Ship,
        title: 'Ocean Freight',
        description: 'Cost-effective sea freight solutions for bulk and oversized cargo.',
        color: 'from-cyan-600 to-teal-600',
        delay: 0.1
    },
    {
        icon: Truck,
        title: 'Ground Transport',
        description: 'Efficient door-to-door delivery across domestic and international routes.',
        color: 'from-teal-600 to-green-600',
        delay: 0.2
    },
    {
        icon: Package,
        title: 'Express Delivery',
        description: 'Same-day and next-day delivery for urgent shipments.',
        color: 'from-purple-600 to-pink-600',
        delay: 0.3
    },
    {
        icon: Globe,
        title: 'International Shipping',
        description: 'Seamless cross-border logistics with customs clearance support.',
        color: 'from-orange-600 to-red-600',
        delay: 0.4
    },
    {
        icon: Clock,
        title: '24/7 Real-Time Tracking',
        description: 'Live shipment tracking with automated status updates and notifications.',
        color: 'from-indigo-600 to-purple-600',
        delay: 0.5
    },
    {
        icon: Shield,
        title: 'Secure Handling',
        description: 'Advanced security measures and insurance for high-value shipments.',
        color: 'from-pink-600 to-rose-600',
        delay: 0.6
    },
    {
        icon: Zap,
        title: 'AI-Powered Optimization',
        description: 'Smart route planning and predictive analytics for maximum efficiency.',
        color: 'from-yellow-600 to-orange-600',
        delay: 0.7
    }
];

const ServiceCard = ({ service, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: service.delay }}
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300 }
            }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                x.set(e.clientX - centerX);
                y.set(e.clientY - centerY);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            className="relative group cursor-pointer"
        >
            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${service.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

            {/* Card */}
            <div className="relative glass-card p-8 h-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden">
                {/* Animated background gradient */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />

                {/* Icon */}
                <motion.div
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-2xl`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <service.icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-cyan-300 transition-all duration-300">
                    {service.title}
                </h3>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {service.description}
                </p>

                {/* Hover arrow */}
                <motion.div
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                >
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-cyan-400 text-2xl font-bold"
                    >
                        →
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Services = () => {
    return (
        <section className="py-32 px-6 bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                            Our Services
                        </h2>
                        <motion.div
                            className="h-1.5 w-32 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </motion.div>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                        Comprehensive logistics solutions powered by cutting-edge technology and
                        <span className="text-cyan-400 font-semibold"> unmatched expertise</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(56, 189, 248, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                        Explore All Services
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
