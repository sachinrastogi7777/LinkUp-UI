import React from "react";
import { PageLayout } from "../PageLayout";

export const CommunityGuidelines = () => (
    <PageLayout title="Community Guidelines">
        <section>
            <h2 className="text-xl font-semibold mb-3">Our Community Standards</h2>
            <p>
                LinkUp is built on respect, authenticity, and kindness. These guidelines help
                ensure our platform remains a safe and welcoming space for everyone.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Be Respectful</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Treat others with dignity and respect</li>
                <li>Embrace diversity and different perspectives</li>
                <li>Avoid hate speech, discrimination, or harassment</li>
                <li>Respect others' boundaries and privacy</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Be Authentic</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Use your real identity</li>
                <li>Don't impersonate others</li>
                <li>Share genuine content and experiences</li>
                <li>Be honest in your interactions</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Keep It Safe</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>No illegal activities or content</li>
                <li>No sexual or violent content</li>
                <li>Don't share harmful or dangerous information</li>
                <li>Report suspicious behavior or content</li>
                <li>Protect minors - no exploitation of any kind</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Consequences</h2>
            <p>
                Violations of these guidelines may result in content removal, account suspension,
                or permanent ban, depending on severity. We take these matters seriously to
                protect our community.
            </p>
        </section>
    </PageLayout>
);