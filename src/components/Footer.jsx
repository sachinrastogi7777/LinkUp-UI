import React from 'react';
import { Heart, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Github, MessageCircle, Info, Shield, FileText, HelpCircle, Users, Sparkles } from 'lucide-react';
import logo from '../assets/linkup-icon.png'
import { useSelector } from 'react-redux';

const Footer = () => {
    const userData = useSelector((store) => store.user);
    const userLoggedIn = userData ? true : false;
    const currentYear = new Date().getFullYear();
    if (!userLoggedIn) {
        return (
            <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-20 flex items-center justify-center">
                                    <img
                                        src={logo}
                                        alt="LinkUp Logo"
                                        className='logo-rotate'
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">Link Up</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Connect, share, and grow with a community that cares. Join thousands of users building meaningful relationships every day.
                            </p>
                            <div className="flex gap-3 mt-4">
                                <a href="#" className="w-10 h-10 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Github className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                Quick Links
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:w-2 transition-all"></span>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Press Kit
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Support
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Community Guidelines
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Safety Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Report Abuse
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all"></span>
                                        Contact Support
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Get in Touch
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white font-medium">Email</p>
                                        <a href="mailto:support@socialhub.com" className="hover:text-pink-400 transition-colors">
                                            support@socialhub.com
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white font-medium">Phone</p>
                                        <a href="tel:+15551234567" className="hover:text-pink-400 transition-colors">
                                            +1 (555) 123-4567
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white font-medium">Address</p>
                                        <p>123 Social Street<br />San Francisco, CA 94102</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-t border-white border-opacity-10 pt-8 mb-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
                            <p className="text-gray-300 text-sm mb-4">Subscribe to our newsletter for the latest updates and features</p>
                            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-pink-400 text-white placeholder-gray-400"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white border-opacity-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Cookie Policy
                            </a>
                        </div>
                        <p className="text-gray-300 text-sm flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-pink-400 fill-current" /> Link Up {currentYear}
                        </p>
                    </div>
                </div>
            </footer>
        );
    } else {
        return (
            <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white border-t border-white border-opacity-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="LinkUp Logo"
                                    className='logo-rotate'
                                />
                            </div>
                            <span className="text-lg font-bold">Link Up</span>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <HelpCircle className="w-4 h-4" />
                                Help
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                Privacy
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Terms
                            </a>
                            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Community
                            </a>
                        </div>

                        {/* Social & Copyright */}
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <a href="#" className="w-8 h-8 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-white text-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                            <span className="text-gray-200 text-sm hidden md:block">{currentYear}</span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;