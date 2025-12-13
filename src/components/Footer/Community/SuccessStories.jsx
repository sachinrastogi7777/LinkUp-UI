import React from "react";
import { PageLayout } from "../PageLayout";

export const SuccessStories = () => (
    <PageLayout title="Success Stories">
        <section>
            <h2 className="text-xl font-semibold mb-3">Real Connections, Real Stories</h2>
            <p>
                Every day, people use LinkUp to make meaningful connections that change their lives.
                Here are just a few of the amazing stories from our community.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Featured Stories</h2>
            <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="italic">
                        "I moved to a new city and didn't know anyone. LinkUp helped me find a
                        group of friends who share my interests. Now we meet up every week!"
                    </p>
                    <p className="mt-2 text-sm text-gray-600">- Sarah, 28</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="italic">
                        "As an introvert, making friends has always been challenging. LinkUp gave
                        me the confidence to connect with people at my own pace. I've made some
                        incredible friendships."
                    </p>
                    <p className="mt-2 text-sm text-gray-600">- Michael, 35</p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Share Your Story</h2>
            <p>
                Have a success story to share? We'd love to hear how LinkUp has helped you connect.
                Email us at{' '}
                <a href="mailto:stories@linkup.com" className="text-purple-600 hover:underline">
                    stories@linkup.com
                </a>
            </p>
        </section>
    </PageLayout>
);