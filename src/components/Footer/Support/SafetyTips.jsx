import React from "react";
import { PageLayout } from "../PageLayout";

export const SafetyTips = () => (
    <PageLayout title="Safety Tips">
        <section>
            <h2 className="text-xl font-semibold mb-3">Your Safety Matters</h2>
            <p>
                At LinkUp, your safety is our top priority. Follow these guidelines to ensure
                a secure and positive experience on our platform.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Protect Your Personal Information</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Never share your password with anyone</li>
                <li>Be cautious about sharing personal details like address or phone number</li>
                <li>Use strong, unique passwords</li>
                <li>Enable two-factor authentication when available</li>
                <li>Be wary of suspicious links or requests</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Meeting People Online</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Take time to get to know people before meeting in person</li>
                <li>Meet in public places for first meetings</li>
                <li>Tell a friend or family member about your plans</li>
                <li>Trust your instincts - if something feels wrong, it probably is</li>
                <li>Arrange your own transportation</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Reporting Issues</h2>
            <p>
                If you encounter harassment, suspicious behavior, or inappropriate content,
                please report it immediately. We take all reports seriously and will take
                appropriate action to keep our community safe.
            </p>
        </section>
    </PageLayout>
);