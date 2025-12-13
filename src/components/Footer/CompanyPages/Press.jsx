import React from "react";
import { PageLayout } from "../PageLayout";

export const Press = () => (
    <PageLayout title="Press">
        <section>
            <h2 className="text-xl font-semibold mb-3">Media Resources</h2>
            <p>
                Welcome to the LinkUp press center. Here you'll find the latest news, press releases,
                and media resources about our platform and company.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Recent News</h2>
            <p>
                Stay updated with our latest announcements, product launches, and company milestones.
                We're committed to transparency and keeping our community informed.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Brand Assets</h2>
            <p>
                Need our logo, brand guidelines, or official images? Our brand assets are available
                for approved media use. Please contact our press team for access.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Media Inquiries</h2>
            <p>
                For press inquiries, interviews, or media requests, please contact:{' '}
                <a href="mailto:press@linkup.com" className="text-purple-600 hover:underline">
                    press@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);