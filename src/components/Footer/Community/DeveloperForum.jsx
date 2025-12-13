import React from "react";
import { PageLayout } from "../PageLayout";

export const DeveloperForum = () => (
    <PageLayout title="Developer Forum">
        <section>
            <h2 className="text-xl font-semibold mb-3">Welcome Developers</h2>
            <p>
                Join our developer community to discuss LinkUp's API, share integrations,
                get technical support, and collaborate with other developers.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Forum Topics</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>API documentation and best practices</li>
                <li>Integration tutorials and examples</li>
                <li>Bug reports and feature requests</li>
                <li>Technical discussions and troubleshooting</li>
                <li>Platform updates and announcements</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <p>
                New to LinkUp development? Check out our API documentation and quickstart guide
                to begin building amazing integrations.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Developer Support</h2>
            <p>
                Need technical assistance?{' '}
                <a href="mailto:developers@linkup.com" className="text-purple-600 hover:underline">
                    developers@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);