import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Loader2, MapPin, Lock } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import PremiumWarning from './PremiumWarning';

const MutualConnectionsModal = ({ isOpen, onClose, targetUser, isPremium }) => {
    const [mutualConnections, setMutualConnections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && targetUser?._id && isPremium) {
            fetchMutualConnections();
            document.body.style.overflow = 'hidden';
        } else if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, targetUser, isPremium]);

    const fetchMutualConnections = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${BASE_URL}/user/mutualConnections/${targetUser._id}`,
                { withCredentials: true }
            );

            if (response.data) {
                setMutualConnections(response.data.mutualConnections || []);
            }
        } catch (err) {
            console.error('Error fetching mutual connections:', err);
            setError('Failed to load mutual connections');
            setMutualConnections([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-fadeIn relative z-[100000]"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: 'modalSlideIn 0.3s ease-out'
                }}
            >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                Mutual Connections
                            </h2>
                            {targetUser && (
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                    with <span className="font-semibold">{targetUser.firstName} {targetUser.lastName}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors group"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {!isPremium ? (
                        <PremiumWarning />
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
                            <p className="text-gray-500 text-sm">Loading mutual connections...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">{error}</p>
                            <button
                                onClick={fetchMutualConnections}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : mutualConnections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No mutual connections found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {mutualConnections.map((user, index) => (
                                <div
                                    key={user._id}
                                    className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-purple-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-purple-200"
                                    style={{
                                        animation: `fadeInUp 0.3s ease-out forwards`,
                                        animationDelay: `${index * 0.05}s`,
                                        opacity: 0
                                    }}
                                >
                                    <div className="flex items-center gap-3 sm:hidden">
                                        <img
                                            src={user.profileImage}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-purple-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                @{user.userName}
                                            </p>
                                            {user.location && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {user.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-4">
                                        <img
                                            src={user.profileImage}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-purple-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-base truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                @{user.userName}
                                            </p>
                                        </div>
                                        {user.location && (
                                            <div className="flex items-center gap-1 text-gray-400 text-sm flex-shrink-0">
                                                <MapPin className="w-4 h-4" />
                                                <span>{user.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isPremium && !loading && mutualConnections.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-b-2xl">
                        <p className="text-center text-xs sm:text-sm text-gray-700 font-medium">
                            <span className="text-purple-600 font-bold">{mutualConnections.length}</span> mutual connection{mutualConnections.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default MutualConnectionsModal;