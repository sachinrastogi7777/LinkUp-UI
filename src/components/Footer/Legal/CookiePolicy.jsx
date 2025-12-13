import React from "react";
import { PageLayout } from "../PageLayout";

export const CookiePolicy = () => (
    <PageLayout title="Cookie Policy">
        <section>
            <h2 className="text-xl font-semibold mb-3">What Are Cookies?</h2>
            <p>
                Cookies are small text files stored on your device when you visit websites.
                They help us provide you with a better experience by remembering your preferences
                and helping us understand how you use our service.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
            <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                    <strong>Essential Cookies:</strong> Required for the website to function properly,
                    including authentication and security.
                </li>
                <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors use our site
                    so we can improve it.
                </li>
                <li>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences for
                    a personalized experience.
                </li>
                <li>
                    <strong>Marketing Cookies:</strong> Track your activity to deliver relevant
                    advertisements (if applicable).
                </li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
            <p>
                You can control and manage cookies through your browser settings. Please note that
                disabling certain cookies may impact your experience on LinkUp.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Cookies</h2>
            <p>
                We use Google OAuth for authentication, which may set its own cookies. Please
                refer to Google's privacy policy for information about their cookie practices.
            </p>
        </section>
    </PageLayout>
);