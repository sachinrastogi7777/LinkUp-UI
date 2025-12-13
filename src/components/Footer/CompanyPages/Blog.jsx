import React from "react";
import { PageLayout } from "../PageLayout";

export const Blog = () => (
    <PageLayout title="Blog">
        <section>
            <h2 className="text-xl font-semibold mb-3">Latest from LinkUp</h2>
            <p>
                Stay connected with the latest updates, tips, and stories from the LinkUp community.
                Our blog features insights on digital connection, platform updates, and user success stories.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Topics We Cover</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Platform updates and new features</li>
                <li>Tips for making meaningful connections</li>
                <li>User success stories</li>
                <li>Online safety and digital wellbeing</li>
                <li>Community spotlights</li>
                <li>Industry trends and insights</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Subscribe</h2>
            <p>
                Get the latest posts delivered directly to your inbox. Subscribe to our newsletter
                to never miss an update.
            </p>
        </section>
    </PageLayout>
);