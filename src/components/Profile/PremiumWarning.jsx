import React from 'react'
import { Lock } from 'lucide-react';

const PremiumWarning = () => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 sm:p-8 text-center">
            <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Unlock Connections</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">Upgrade to Premium to see who's connected with this user</p>
                <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base">
                    Get Premium for $5/month
                </button>
                <p className="text-xs text-gray-500 mt-3 sm:mt-4">✨ Unlock exclusive features and connections</p>
            </div>
        </div>
    )
}

export default PremiumWarning;