import { useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';

const useHeartbeat = (isAuthenticated) => {
    const heartbeatIntervalRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // Clean up if user logs out
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
            return;
        }

        const sendHeartbeat = async () => {
            try {
                await axios.post(`${BASE_URL}/heartbeat`, {}, {
                    withCredentials: true
                });
            } catch (error) {
                // Silently fail - don't spam console
                if (error.response?.status === 401) {
                    // User not authenticated, stop heartbeat
                    if (heartbeatIntervalRef.current) {
                        clearInterval(heartbeatIntervalRef.current);
                        heartbeatIntervalRef.current = null;
                    }
                }
            }
        };

        // Send initial heartbeat
        sendHeartbeat();

        // Send heartbeat every 60 seconds (1 minute)
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, 60000);

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // User came back to the tab
                sendHeartbeat();

                // Restart interval to ensure it's running
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                }
                heartbeatIntervalRef.current = setInterval(sendHeartbeat, 60000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup function
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated]);
};

export default useHeartbeat;