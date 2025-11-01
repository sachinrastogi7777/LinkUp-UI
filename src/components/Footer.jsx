import React from 'react';
import { Heart, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Shield, FileText, HelpCircle, Users, Send, Copyright } from 'lucide-react';
import logo from '../assets/linkup-icon.png'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
    const userData = useSelector((store) => store.user);
    const userLoggedIn = userData ? true : false;
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Press', path: '/press' },
            { name: 'Blog', path: '/blog' }
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'Safety Tips', path: '/safety' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'FAQs', path: '/faq' }
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Cookie Policy', path: '/cookies' },
            { name: 'Community Guidelines', path: '/guidelines' }
        ],
        community: [
            { name: 'Success Stories', path: '/stories' },
            { name: 'Events', path: '/events' },
            { name: 'Developer Forum', path: '/forum' },
            { name: 'Partnerships', path: '/partners' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
        { icon: Twitter, url: 'https://twitter.com', label: 'Twitter' },
        { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
        { icon: Linkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    ];

    if (!userLoggedIn) {
        return (
            <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
                <div className="border-b border-white border-opacity-10">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Stay Connected
                                </h3>
                                <p className="text-gray-300 text-xs sm:text-sm">
                                    Get the latest updates, tips, and exclusive offers
                                </p>
                            </div>
                            <div className="flex w-full md:w-auto max-w-md">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 backdrop-blur-sm text-sm sm:text-base"
                                />
                                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline">Subscribe</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                    <img
                                        src={logo}
                                        alt="LinkUp Logo"
                                        className='logo-rotate'
                                    />
                                </div>
                                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Link Up</span>
                            </div>
                            <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed mt-3">
                                Connect, share, and grow with a community that cares. Join thousands of users building meaningful relationships every day.
                            </p>

                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                                    <span className="break-all">support@linkup.com</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                                    <span>+91 (999) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                                    <span>Patna, Bihar</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Company</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-300 hover:text-purple-400 transition-colors text-xs sm:text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Support</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-300 hover:text-purple-400 transition-colors text-xs sm:text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Legal</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-300 hover:text-purple-400 transition-colors text-xs sm:text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Community</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {footerLinks.community.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-300 hover:text-purple-400 transition-colors text-xs sm:text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-white border-opacity-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <Link
                                            key={social.label}
                                            to={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-9 h-9 sm:w-10 sm:h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110"
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                                    <span className="flex items-center gap-1.5 sm:gap-2">
                                        <Copyright className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>LinkUp {currentYear}</span>
                                    </span>
                                    <span className="hidden sm:inline">All rights reserved.</span>
                                </div>
                                <p className="text-gray-300 text-xs mt-1 flex items-center justify-center md:justify-end gap-1">
                                    Made with <Heart className="w-3 h-3 text-pink-500" /> for creators, by creators.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white border-opacity-10">
                        <div className="text-center">
                            <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm">Download our mobile app</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                <button className="flex items-center cursor-pointer gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-black bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20 backdrop-blur-sm w-full sm:w-auto max-w-xs">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-400">Download on the</p>
                                        <p className="text-sm font-semibold">App Store</p>
                                    </div>
                                </button>
                                <button className="flex items-center cursor-pointer gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-black bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20 backdrop-blur-sm w-full sm:w-auto max-w-xs">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-400">Get it on</p>
                                        <p className="text-sm font-semibold">Google Play</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    } else {
        return (
            <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white border-t border-white border-opacity-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="LinkUp Logo"
                                    className='logo-rotate'
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Link Up</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-200">
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Help</span>
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Privacy</span>
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Terms</span>
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Community</span>
                            </a>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <Link
                                            key={social.label}
                                            to={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110"
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </Link>
                                    );
                                })}
                            </div>
                            <span className="text-gray-200 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                                <Copyright className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{currentYear}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;