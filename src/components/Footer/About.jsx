import React from "react";
import { PageLayout } from "./PageLayout";

export const AboutUs = () => (
    <PageLayout title="About Us">
        <section>
            <h2 className="text-xl font-semibold mb-3">Our Story</h2>
            <p>
                LinkUp was founded with a simple mission: to help people connect meaningfully
                in an increasingly digital world. We believe that authentic connections lead
                to stronger communities and happier lives.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
            <p>
                To create a safe, inclusive platform where people can build genuine relationships,
                share experiences, and grow together. We're committed to fostering connections
                that matter.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Our Values</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Authenticity - Be yourself, always</li>
                <li>Safety - Creating a secure environment for all users</li>
                <li>Inclusivity - Everyone deserves a place to connect</li>
                <li>Innovation - Constantly improving the user experience</li>
                <li>Privacy - Your data, your control</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Our Team</h2>
            <p>
                We're a diverse team of passionate individuals dedicated to building the best
                social platform. From engineers to designers, community managers to support
                specialists, we all share the same goal: helping you connect.
            </p>
        </section>
    </PageLayout>
);