import React from "react";
import { PageLayout } from "../PageLayout";

export const ShippingDelivery = () => (
    <PageLayout title="Shipping & Delivery Policy">
        <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p>
                LinkUp is a digital service platform providing social networking and connection
                services through our web and mobile applications. As we offer exclusively digital
                services, we do not ship physical products or goods.
            </p>
            <p className="mt-2">
                <strong>Last Updated:</strong> December 27, 2024
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Digital Service Delivery</h2>
            <p>
                All LinkUp services are delivered digitally through our platform. This includes:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Premium subscription features and benefits</li>
                <li>Access to advanced platform functionalities</li>
                <li>Profile enhancements and exclusive tools</li>
                <li>Communication and messaging capabilities</li>
                <li>All other premium features offered on our platform</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Instant Access</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Immediate Activation</h3>
            <p>
                Upon successful payment and subscription confirmation, your premium features
                will be activated instantly. You will receive immediate access to all subscribed
                services without any waiting period.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Account Activation Process</h3>
            <ol className="list-decimal ml-6 mt-2 space-y-1">
                <li>Complete your payment through our secure payment gateway</li>
                <li>Receive payment confirmation via email</li>
                <li>Premium features are automatically activated on your account</li>
                <li>Start enjoying enhanced capabilities immediately</li>
            </ol>

            <h3 className="text-lg font-semibold mt-4 mb-2">Confirmation Email</h3>
            <p>
                After successful subscription purchase, you will receive a confirmation email
                containing:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Subscription details and plan information</li>
                <li>Receipt and transaction ID</li>
                <li>Billing cycle dates</li>
                <li>List of activated premium features</li>
                <li>Link to manage your subscription</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Service Accessibility</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Platform Availability</h3>
            <p>
                LinkUp services are accessible 24/7 through:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Web browser (linkup.com)</li>
                <li>iOS mobile application (coming soon)</li>
                <li>Android mobile application (coming soon)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Geographic Availability</h3>
            <p>
                LinkUp services are currently available worldwide. However, certain features
                may have regional restrictions based on local regulations and compliance
                requirements. Users are responsible for ensuring their use of LinkUp complies
                with local laws and regulations.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">System Requirements</h3>
            <p>
                To ensure optimal service delivery, please ensure your device meets the
                following minimum requirements:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Web Browser:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
                <li><strong>Internet Connection:</strong> Stable broadband or mobile data connection</li>
                <li><strong>Operating System:</strong> Windows 10+, macOS 10.14+, iOS 13+, Android 8.0+</li>
                <li><strong>JavaScript:</strong> Must be enabled in browser</li>
                <li><strong>Cookies:</strong> Must be enabled for authentication</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Service Interruptions</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Scheduled Maintenance</h3>
            <p>
                We may occasionally perform scheduled maintenance to improve our services.
                During maintenance periods:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Users will be notified at least 24 hours in advance via email</li>
                <li>Maintenance will be scheduled during low-traffic hours when possible</li>
                <li>Service interruptions will be kept to a minimum</li>
                <li>No charges or fees will apply during maintenance periods</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Unplanned Outages</h3>
            <p>
                In case of unexpected service disruptions:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Our technical team will work to restore services as quickly as possible</li>
                <li>Status updates will be posted on our social media channels</li>
                <li>Users experiencing issues can check our status page or contact support</li>
                <li>Extended outages may result in subscription extensions (case-by-case basis)</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Subscription Delivery Timeline</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Payment Processing Time</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Credit/Debit Cards:</strong> Instant processing and activation</li>
                <li><strong>Digital Wallets:</strong> Instant processing and activation</li>
                <li><strong>Bank Transfers:</strong> 1-3 business days for verification</li>
                <li><strong>Other Payment Methods:</strong> As specified by payment provider</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Delayed Activation</h3>
            <p>
                If your premium features are not activated within the expected timeframe:
            </p>
            <ol className="list-decimal ml-6 mt-2 space-y-1">
                <li>Check your email for payment confirmation</li>
                <li>Verify that payment was successfully processed</li>
                <li>Log out and log back into your account</li>
                <li>Clear browser cache and cookies</li>
                <li>Contact support if issues persist beyond 30 minutes</li>
            </ol>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Account Access Issues</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Troubleshooting Access Problems</h3>
            <p>
                If you're unable to access your premium features after purchase:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Ensure you're logged into the correct account used for purchase</li>
                <li>Check your internet connection stability</li>
                <li>Try accessing from a different device or browser</li>
                <li>Verify your subscription status in account settings</li>
                <li>Contact support with your transaction details</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Device Compatibility</h3>
            <p>
                Your premium subscription works across all supported devices. Simply log in
                with your account credentials on any device to access your premium features.
                No additional setup or "shipping" to new devices is required.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Merchandise</h2>
            <p>
                While LinkUp currently does not sell physical merchandise, we may introduce
                branded products in the future. If and when physical products become available:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>A separate shipping and delivery policy will be provided</li>
                <li>Shipping costs, timelines, and regions will be clearly specified</li>
                <li>Tracking information will be provided for all physical shipments</li>
                <li>Standard return and exchange policies will apply</li>
            </ul>
            <p className="mt-2">
                Users will be notified of any new physical product offerings through email
                and in-app notifications.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Data Portability</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Export Your Data</h3>
            <p>
                While not traditional "delivery," LinkUp provides users with the ability to
                export their personal data:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Request a copy of your data through account settings</li>
                <li>Data will be prepared within 7-14 business days</li>
                <li>Download link will be sent to your registered email</li>
                <li>Data package includes profile information, messages, and activity history</li>
                <li>Export is available in standard formats (JSON, CSV)</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Service Level Agreement (SLA)</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2">Uptime Guarantee</h3>
            <p>
                LinkUp strives to maintain 99.5% uptime for our services. While we cannot
                guarantee 100% availability due to factors beyond our control (internet
                connectivity, device issues, force majeure events), we are committed to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Minimizing downtime through redundant systems</li>
                <li>Rapid response to technical issues</li>
                <li>Transparent communication during outages</li>
                <li>Continuous monitoring and improvement of infrastructure</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Service Credits</h3>
            <p>
                In the event of extended service disruptions affecting premium subscribers:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Outages exceeding 24 consecutive hours may qualify for subscription credits</li>
                <li>Credits will be automatically applied to your account</li>
                <li>Credit amount will be prorated based on downtime duration</li>
                <li>Credits can be used toward future subscription renewals</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Technical Support</h2>
            <p>
                For assistance with service access, activation issues, or technical problems:
            </p>
            <ul className="list-none ml-0 mt-2 space-y-1">
                <li><strong>Email Support:</strong> support@linkup.com</li>
                <li><strong>Technical Support:</strong> tech@linkup.com</li>
                <li><strong>Live Chat:</strong> Available in-app (9 AM - 6 PM IST, Monday-Friday)</li>
                <li><strong>Help Center:</strong> help.linkup.com</li>
                <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">International Users</h2>
            <p>
                LinkUp services are available internationally. Please note:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Services are provided in English (additional languages coming soon)</li>
                <li>Payment processing may incur currency conversion fees from your bank</li>
                <li>Connection speeds depend on local internet infrastructure</li>
                <li>Some features may be restricted based on regional regulations</li>
                <li>Customer support operates in English and Hindi</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-3">Policy Updates</h2>
            <p>
                LinkUp reserves the right to modify this Shipping & Delivery Policy at any
                time. Changes will be posted on this page with an updated "Last Updated" date.
                Significant changes will be communicated via email to active subscribers.
            </p>
        </section>

        <section className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
                <strong>Note:</strong> This policy applies exclusively to digital services
                provided by LinkUp. As a digital-first platform, we do not handle physical
                product shipments. All services are delivered electronically and accessible
                immediately upon subscription activation. If you have questions about service
                delivery or access, please contact our support team.
            </p>
        </section>
    </PageLayout>
);