import React from "react";
import { PageLayout } from "../PageLayout";

export const CancellationRefund = () => (
    <PageLayout title="Cancellation & Refund Policy">
        <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p>
                At LinkUp, we strive to provide the best service experience. This Cancellation
                & Refund Policy outlines the terms and conditions for subscription cancellations
                and refund requests for our premium services.
            </p>
            <p className="mt-2">
                <strong>Last Updated:</strong> December 27, 2024
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Premium Subscription</h2>
            <p>
                LinkUp offers premium subscription plans that provide access to exclusive features
                such as viewing mutual connections, unlimited swipes, advanced filters, and more.
                Our premium plans are available on a monthly or yearly basis.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Cancellation Policy</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">How to Cancel</h3>
            <p>
                You can cancel your premium subscription at any time through your account settings.
                To cancel:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Log in to your LinkUp account</li>
                <li>Navigate to Settings → Subscription</li>
                <li>Click on "Cancel Subscription"</li>
                <li>Confirm your cancellation</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Effect of Cancellation</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Your premium features will remain active until the end of your current billing period</li>
                <li>You will not be charged for the next billing cycle</li>
                <li>After the billing period ends, your account will revert to the free tier</li>
                <li>No refund will be provided for the unused portion of your subscription</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">No Automatic Renewal After Cancellation</h3>
            <p>
                Once you cancel your subscription, it will not automatically renew. You can
                resubscribe at any time to regain access to premium features.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Refund Policy</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">7-Day Money-Back Guarantee</h3>
            <p>
                We offer a 7-day money-back guarantee for first-time premium subscribers. If you're
                not satisfied with your premium subscription within the first 7 days of purchase,
                you can request a full refund.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Eligibility for Refunds</h3>
            <p>Refunds are available under the following conditions:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Request made within 7 days of initial subscription purchase</li>
                <li>First-time premium subscribers only (one-time refund per user)</li>
                <li>Technical issues preventing access to premium features (verified by our support team)</li>
                <li>Duplicate or unauthorized charges</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Non-Refundable Situations</h3>
            <p>Refunds will NOT be provided in the following cases:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Refund requests made after the 7-day guarantee period</li>
                <li>Subscription renewals (monthly or yearly)</li>
                <li>Account suspension or termination due to violation of Terms of Service</li>
                <li>Change of mind after the 7-day period</li>
                <li>Unused premium features during your subscription period</li>
                <li>Partial month refunds for monthly subscriptions</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">How to Request a Refund</h3>
            <p>To request a refund, please follow these steps:</p>
            <ol className="list-decimal ml-6 mt-2 space-y-1">
                <li>Contact our support team at support@linkup.com</li>
                <li>Include your account email, subscription details, and reason for refund</li>
                <li>Provide proof of payment (transaction ID or receipt)</li>
                <li>Our team will review your request within 3-5 business days</li>
            </ol>

            <h3 className="text-lg font-semibold mt-4 mb-2">Refund Processing Time</h3>
            <p>
                Once your refund request is approved, the refund will be processed within 7-10
                business days. The refund will be credited to your original payment method.
                Please note that depending on your bank or payment provider, it may take an
                additional 5-7 business days for the refund to appear in your account.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Technical Issues & Service Interruptions</h2>
            <p>
                If you experience technical difficulties that prevent you from accessing premium
                features, please contact our support team immediately. We will work to resolve
                the issue promptly. If the issue cannot be resolved within a reasonable timeframe,
                you may be eligible for a prorated refund or subscription extension.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Changes to Pricing</h2>
            <p>
                If we change our subscription pricing, existing subscribers will be notified
                at least 30 days in advance. Your current subscription rate will be honored
                until the end of your billing period. After that, the new pricing will apply
                unless you cancel your subscription.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Promotional Offers & Discounts</h2>
            <p>
                Special promotional offers and discounts are subject to their own terms and
                conditions. Refunds for promotional subscriptions may differ from standard
                refund policies. Please review the specific terms of any promotion before
                subscribing.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Account Termination</h2>
            <p>
                If your account is terminated due to violation of our Terms of Service or
                Community Guidelines, no refunds will be issued for any remaining subscription
                period. LinkUp reserves the right to suspend or terminate accounts that violate
                our policies without providing refunds.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Disputed Charges</h2>
            <p>
                If you believe you have been charged incorrectly or notice an unauthorized
                charge on your account, please contact us immediately at billing@linkup.com
                before initiating a chargeback with your bank. We are committed to resolving
                billing issues promptly and fairly.
            </p>
            <p className="mt-2">
                <strong>Note:</strong> Initiating a chargeback without contacting us first may
                result in account suspension until the matter is resolved.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
            <p>
                For any questions regarding cancellations, refunds, or billing issues, please
                contact our support team:
            </p>
            <ul className="list-none ml-0 mt-2 space-y-1">
                <li><strong>Email:</strong> support@linkup.com</li>
                <li><strong>Billing Support:</strong> billing@linkup.com</li>
                <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Policy Updates</h2>
            <p>
                LinkUp reserves the right to modify this Cancellation & Refund Policy at any
                time. Any changes will be posted on this page with an updated "Last Updated"
                date. Continued use of our services after changes are posted constitutes
                acceptance of the modified policy.
            </p>
        </section>

        <section className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
                <strong>Important:</strong> This Cancellation & Refund Policy is part of our
                Terms of Service. By subscribing to LinkUp premium services, you agree to
                these terms. If you have any questions or concerns, please don't hesitate to
                reach out to our support team.
            </p>
        </section>
    </PageLayout>
);