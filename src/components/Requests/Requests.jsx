import { Inbox, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReceivedRequests from './ReceivedRequests'
import SentRequests from './SentRequests'
import { useSelector } from 'react-redux'

const Requests = () => {
    const [activeTab, setActiveTab] = useState('received');
    const receivedRequestsList = useSelector((store) => store.request);
    const sentRequestsList = useSelector((store) => store.sentRequest);
    const [receivedRequestsLength, setReceivedRequestsLength] = useState(receivedRequestsList?.length || 0);
    const [sentRequestsLength, setSentRequestsLength] = useState(sentRequestsList?.length || 0);
    const [isLoadingReceived, setIsLoadingReceived] = useState(true);
    const [isLoadingSent, setIsLoadingSent] = useState(true);

    useEffect(() => {
        if (sentRequestsList && sentRequestsList.length >= 0) {
            setIsLoadingSent(false);
            setSentRequestsLength(sentRequestsList?.length || 0);
        }
    }, [sentRequestsList]);

    useEffect(() => {
        if (receivedRequestsList && receivedRequestsList.length >= 0) {
            setIsLoadingReceived(false);
            setReceivedRequestsLength(receivedRequestsList.length);
        }
    }, [receivedRequestsList]);

    return (
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
            {/* Header */}
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 p-6 md:p-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Friend Requests
                    </h1>
                    <p className="text-gray-600">Manage your connection requests</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mt-8">
                    <div className="bg-gray-100 rounded-2xl p-2 flex">
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'received'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-purple-600'
                                }`}
                        >
                            <Inbox className="w-5 h-5" />
                            Received ({receivedRequestsLength})
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'sent'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-purple-600'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                            Sent ({sentRequestsLength})
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 mb-8">
                {/* Received Requests Tab */}
                {activeTab === 'received' && (
                    <ReceivedRequests
                        onLengthChange={(len) => setReceivedRequestsLength(len)}
                        receivedRequests={receivedRequestsList}
                        isLoadingReceived={isLoadingReceived}
                    />
                )}

                {/* Sent Requests Tab */}
                {activeTab === 'sent' && (
                    <SentRequests
                        onLengthChange={(len) => setSentRequestsLength(len)}
                        sentRequestsData={sentRequestsList}
                        isLoadingSent={isLoadingSent}
                    />
                )}
            </div>
        </div>
    )
}

export default Requests;