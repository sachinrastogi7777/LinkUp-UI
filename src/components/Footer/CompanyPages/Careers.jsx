import React from "react";
import { PageLayout } from "../PageLayout";

export const Careers = () => (
    <PageLayout title="Careers">
        <section>
            <h2 className="text-xl font-semibold mb-3">Join Our Team</h2>
            <p>
                At LinkUp, we're always looking for talented, passionate people who want to make
                a difference in how people connect online. We offer competitive salaries, excellent
                benefits, and a collaborative work environment.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Why Work With Us?</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Flexible remote work options</li>
                <li>Comprehensive health and dental coverage</li>
                <li>Professional development opportunities</li>
                <li>Collaborative and inclusive culture</li>
                <li>Competitive salary and equity packages</li>
                <li>Unlimited PTO policy</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Open Positions</h2>
            <p>
                We're currently hiring for various roles in engineering, design, product management,
                and customer support. Check our careers portal for current openings and application
                details.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Application Process</h2>
            <p>
                Our hiring process typically includes an initial phone screen, technical or role-specific
                interviews, and a final culture fit conversation. We strive to make the process smooth
                and transparent.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p>
                Interested in joining us?{' '}
                <a href="mailto:careers@linkup.com" className="text-purple-600 hover:underline">
                    careers@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);