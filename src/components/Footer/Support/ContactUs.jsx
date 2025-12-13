import React from "react";
import { PageLayout } from "../PageLayout";

export const ContactUs = () => (
    <PageLayout title="Contact Us">
        <section>
            <h2 className="text-xl font-semibold mb-3">Get in Touch</h2>
            <p>
                Have questions, feedback, or need support? We'd love to hear from you.
                Choose the best way to reach us below.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Support</h2>
            <p>
                For technical support or account issues:{' '}
                <a href="mailto:support@linkup.com" className="text-purple-600 hover:underline">
                    support@linkup.com
                </a>
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Business Inquiries</h2>
            <p>
                For partnerships or business opportunities:{' '}
                <a href="mailto:business@linkup.com" className="text-purple-600 hover:underline">
                    business@linkup.com
                </a>
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Press</h2>
            <p>
                For media inquiries:{' '}
                <a href="mailto:press@linkup.com" className="text-purple-600 hover:underline">
                    press@linkup.com
                </a>
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Response Time</h2>
            <p>
                We aim to respond to all inquiries within 24-48 hours during business days.
                For urgent safety concerns, please use the in-app reporting feature for
                immediate attention.
            </p>
        </section>
    </PageLayout>
);