import React from 'react';

export const PageLayout = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
                <div className="space-y-6 text-gray-700">
                    {children}
                </div>
                <div className="mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};