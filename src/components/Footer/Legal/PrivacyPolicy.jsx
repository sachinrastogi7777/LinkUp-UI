import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p>When you use LinkUp, we collect:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Basic profile information (name, email, profile picture)</li>
                            <li>Information you provide when creating your account</li>
                            <li>Usage data and analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Provide and improve our services</li>
                            <li>Enable social features and connections</li>
                            <li>Send important updates about your account</li>
                            <li>Ensure platform security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Google OAuth</h2>
                        <p>
                            When you sign in with Google, we only access your basic profile
                            information (name, email, profile picture) as authorized by you.
                            We do not have access to your Google account password or other
                            sensitive information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your
                            personal information. Your data is encrypted and stored securely.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Access your personal data</li>
                            <li>Request data correction or deletion</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Delete your account at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:your-email@example.com" className="text-purple-600 hover:underline">
                                your-email@example.com
                            </a>
                        </p>
                    </section>

                    <p className="text-sm text-gray-500 mt-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-8">
                    <Link
                        to="/"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;