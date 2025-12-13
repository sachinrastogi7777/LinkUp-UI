import React from "react";
import { PageLayout } from "../PageLayout";

export const HelpCenter = () => (
    <PageLayout title="Help Center">
        <section>
            <h2 className="text-xl font-semibold mb-3">How Can We Help?</h2>
            <p>
                Welcome to the LinkUp Help Center. Find answers to common questions, learn how to use
                our features, and get support when you need it.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Popular Topics</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Getting started with LinkUp</li>
                <li>Account settings and privacy</li>
                <li>Connecting with others</li>
                <li>Reporting and blocking users</li>
                <li>Managing notifications</li>
                <li>Troubleshooting common issues</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Can't Find What You Need?</h2>
            <p>
                Our support team is here to help. Visit our contact page or email us at{' '}
                <a href="mailto:support@linkup.com" className="text-purple-600 hover:underline">
                    support@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);