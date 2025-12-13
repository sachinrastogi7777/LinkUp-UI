import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using LinkUp, you agree to be bound by these Terms of Service
                            and all applicable laws and regulations. If you do not agree with any of these
                            terms, you are prohibited from using this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                        <p>
                            LinkUp is a social networking platform that allows users to connect, share content,
                            and interact with others. We reserve the right to modify, suspend, or discontinue
                            any aspect of the service at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                        <p>To use LinkUp, you must:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Be at least 13 years of age</li>
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. User Conduct</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Post content that is illegal, harmful, threatening, abusive, or offensive</li>
                            <li>Impersonate any person or entity</li>
                            <li>Harass, bully, or intimidate other users</li>
                            <li>Spam or send unsolicited messages</li>
                            <li>Upload viruses or malicious code</li>
                            <li>Violate any intellectual property rights</li>
                            <li>Attempt to gain unauthorized access to the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Content Ownership</h2>
                        <p>
                            You retain ownership of all content you post on LinkUp. However, by posting
                            content, you grant LinkUp a non-exclusive, worldwide, royalty-free license
                            to use, display, reproduce, and distribute your content in connection with
                            operating and promoting the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Content Moderation</h2>
                        <p>
                            We reserve the right to remove any content that violates these Terms of Service
                            or is otherwise objectionable. We may also suspend or terminate accounts that
                            repeatedly violate our policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
                        <p>
                            LinkUp uses Google OAuth for authentication. By using this service, you also
                            agree to Google's Terms of Service and Privacy Policy. We are not responsible
                            for the practices of third-party services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
                        <p>
                            LinkUp is provided "as is" without warranties of any kind, either express or
                            implied. We do not guarantee that the service will be uninterrupted, secure,
                            or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
                        <p>
                            LinkUp shall not be liable for any indirect, incidental, special, consequential,
                            or punitive damages resulting from your use of the service. Our total liability
                            shall not exceed the amount you paid us in the past twelve months.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
                        <p>
                            We may terminate or suspend your account at any time, with or without notice,
                            for conduct that violates these Terms of Service or is harmful to other users,
                            us, or third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms of Service at any time. We will
                            notify users of significant changes. Your continued use of LinkUp after
                            changes are posted constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
                        <p>
                            These Terms of Service are governed by and construed in accordance with
                            applicable laws. Any disputes shall be resolved in the appropriate courts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
                        <p>
                            If you have questions about these Terms of Service, please contact us at:{' '}
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
                    <button
                        onClick={() => window.history.back()}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;