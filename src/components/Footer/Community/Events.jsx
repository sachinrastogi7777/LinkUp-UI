import React from "react";
import { PageLayout } from "../PageLayout";

export const Events = () => (
    <PageLayout title="Events">
        <section>
            <h2 className="text-xl font-semibold mb-3">LinkUp Events</h2>
            <p>
                Join us for virtual and in-person events where you can meet other members of the
                LinkUp community, learn new skills, and have fun together.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
            <p>
                Check back soon for our next community events. From virtual meetups to local
                gatherings, there's always something happening at LinkUp.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Event Types</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Virtual coffee chats and networking</li>
                <li>Local community meetups</li>
                <li>Workshops and skill-sharing sessions</li>
                <li>Special interest group gatherings</li>
                <li>Annual LinkUp conference</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Host Your Own Event</h2>
            <p>
                Interested in organizing an event for your local LinkUp community? Contact our
                events team to learn more about hosting opportunities and support.
            </p>
        </section>
    </PageLayout>
);