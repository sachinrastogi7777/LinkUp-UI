import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../../utils/slice/feedSlice'
import UserCard from './UserCard'
import EmptyFeedPage from './EmptyFeedPage'
import { Loader2 } from 'lucide-react'

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const userFeed = async () => {
            try {
                if (feed) return;
                setLoading(true);
                setError(null);
                const getFeed = await axios.get(BASE_URL + '/feed', { withCredentials: true });
                dispatch(addFeed(getFeed.data.data));
                if (getFeed.data.data && getFeed.data.data.length > 0) {
                    setCurrentIndex(Math.floor(Math.random() * getFeed.data.data.length));
                }
            } catch (err) {
                console.error('Feed error:', err);
                setError(err.response?.data?.ERROR || 'Failed to load feed');
                dispatch(addFeed([]));
            } finally {
                setLoading(false);
            }
        };
        userFeed();
    }, [feed, dispatch])

    useEffect(() => {
        if (feed && feed.length > 0) {
            const newIndex = Math.floor(Math.random() * feed.length);
            setCurrentIndex(newIndex);
        }
    }, [feed?.length]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading amazing profiles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!feed || feed.length === 0) {
        return <EmptyFeedPage />
    }
    const currentUser = feed[currentIndex];

    if (!currentUser) {
        return <EmptyFeedPage />
    }

    return (
        <div className='flex justify-center py-16'>
            <UserCard user={currentUser} key={currentUser._id} />
        </div>
    )
}

export default Feed;