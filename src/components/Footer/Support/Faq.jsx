import React from "react";
import { PageLayout } from "../PageLayout";

export const FAQs = () => (
    <PageLayout title="FAQs">
        <section>
            <h2 className="text-xl font-semibold mb-3">General Questions</h2>
            <div className="space-y-4">
                <div>
                    <p className="font-semibold">What is LinkUp?</p>
                    <p className="mt-1">
                        LinkUp is a social networking platform designed to help people make meaningful
                        connections and build authentic relationships in a safe, inclusive environment.
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Is LinkUp free to use?</p>
                    <p className="mt-1">
                        Yes, LinkUp is free to use with optional premium features available for enhanced
                        functionality.
                    </p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Account & Privacy</h2>
            <div className="space-y-4">
                <div>
                    <p className="font-semibold">How do I create an account?</p>
                    <p className="mt-1">
                        You can sign up using your Google account through our secure OAuth integration.
                        Simply click "Sign in with Google" on our homepage.
                    </p>
                </div>
                <div>
                    <p className="font-semibold">How is my data protected?</p>
                    <p className="mt-1">
                        We use industry-standard encryption and security measures to protect your data.
                        Read our Privacy Policy for detailed information.
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Can I delete my account?</p>
                    <p className="mt-1">
                        Yes, you can delete your account at any time from your account settings. This
                        action is permanent and cannot be undone.
                    </p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Safety & Moderation</h2>
            <div className="space-y-4">
                <div>
                    <p className="font-semibold">How do I report inappropriate content?</p>
                    <p className="mt-1">
                        Click the report button on any post or profile. Our moderation team reviews
                        all reports promptly.
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Can I block users?</p>
                    <p className="mt-1">
                        Yes, you can block any user from their profile page. Blocked users cannot
                        see your content or contact you.
                    </p>
                </div>
            </div>
        </section>
    </PageLayout>
);