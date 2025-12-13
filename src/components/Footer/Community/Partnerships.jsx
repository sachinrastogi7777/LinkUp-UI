import React from "react";
import { PageLayout } from "../PageLayout";

export const Partnerships = () => (
    <PageLayout title="Partnerships">
        <section>
            <h2 className="text-xl font-semibold mb-3">Partner With LinkUp</h2>
            <p>
                We're always looking for strategic partnerships that align with our mission of
                helping people connect meaningfully. Let's explore how we can work together.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Partnership Opportunities</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Technology integrations and API partnerships</li>
                <li>Co-marketing and promotional campaigns</li>
                <li>Content collaborations</li>
                <li>Event sponsorships</li>
                <li>Academic and research partnerships</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Current Partners</h2>
            <p>
                We're proud to work with organizations that share our commitment to building
                meaningful connections and fostering inclusive communities.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Get in Touch</h2>
            <p>
                Interested in partnering with LinkUp?{' '}
                <a href="mailto:partnerships@linkup.com" className="text-purple-600 hover:underline">
                    partnerships@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);