import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
        { icon: Twitter, href: '#', color: 'hover:text-cyan-400' },
        { icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
        { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-black to-slate-950 border-t border-white/10 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2"
                    >
                        <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            ADYAM
                        </h3>
                        <p className="text-lg font-semibold text-white mb-2">
                            Logistic Services Private Limited
                        </p>
                        <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                            Your trusted partner in global logistics and supply chain solutions.
                            Delivering excellence with cutting-edge technology and unmatched expertise.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10 hover:border-white/20`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Services', 'Track Shipment', 'Pricing', 'Contact'].map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-all duration-300 flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                                    {link}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                                <Mail className="w-5 h-5 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">info@adyamlogistics.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                                <Phone className="w-5 h-5 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">+91 99484 05108</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                                <MapPin className="w-5 h-5 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">India</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Adyam Logistic Services Private Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                            Privacy Policy
                        </motion.a>
                        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                            Terms of Service
                        </motion.a>
                        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                            Cookie Policy
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
