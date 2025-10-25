import { useEffect } from 'react';
import { BASE_URL } from '../constants';

const useOfflineStatus = (isAuthenticated) => {
    useEffect(() => {
        if (!isAuthenticated) return;

        const setOfflineStatus = () => {
            try {
                const url = `${BASE_URL}/offline`;

                // Use sendBeacon for reliable delivery when page is closing
                // sendBeacon is specifically designed for this use case
                if (navigator.sendBeacon) {
                    // sendBeacon requires a Blob or FormData
                    const blob = new Blob(['{}'], { type: 'application/json' });
                    navigator.sendBeacon(url, blob);
                } else {
                    // Fallback for browsers that don't support sendBeacon
                    // Use synchronous XHR as last resort (not ideal but works)
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', url, false); // false = synchronous
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send('{}');
                }
            } catch (error) {
                // Silently fail - we don't want to interrupt page unload
                console.error('Failed to set offline status:', error);
            }
        };

        // Handle page unload (closing tab/window/refresh)
        const handleBeforeUnload = () => {
            setOfflineStatus();
        };

        // Handle page hide (more reliable on mobile browsers)
        const handlePageHide = () => {
            setOfflineStatus();
        };

        // Use both events for maximum compatibility
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [isAuthenticated]);
};

export default useOfflineStatus;