import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../../utils/slice/feedSlice'
import UserCard from './UserCard'
import EmptyFeedPage from './EmptyFeedPage'

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    useEffect(() => {
        const userFeed = async () => {
            try {
                if (feed) return;
                const getFeed = await axios.get(BASE_URL + '/feed', { withCredentials: true });
                dispatch(addFeed(getFeed.data.data));
            } catch (err) {
                console.log(err);
            }
        };
        userFeed();
    }, [feed, dispatch])

    if (!feed) return;
    if (feed.length === 0) return <EmptyFeedPage />
    const randomFeedCounter = Math.floor(Math.random() * (feed?.length || 0))
    return (
        feed && (
            <div className='flex justify-center py-16' >
                <UserCard user={feed[randomFeedCounter]} />
            </div >
        )
    )
}

export default Feed;