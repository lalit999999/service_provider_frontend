import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';

/**
 * Custom hook to monitor server health
 * Sends a request every minute and returns the health status
 * @returns {Object} { isHealthy, status, timestamp, uptime, error, lastChecked }
 */
export const useServerHealth = () => {
    const [health, setHealth] = useState({
        isHealthy: null,
        status: null,
        timestamp: null,
        uptime: null,
        error: null,
        lastChecked: null,
    });

    const checkHealth = useCallback(async () => {
        try {
            console.log('[Health Check] Pinging server...');
            const response = await axiosInstance.get('/health');

            const healthData = {
                isHealthy: response.status === 200,
                status: response.data.status,
                timestamp: response.data.timestamp,
                uptime: response.data.uptime,
                error: null,
                lastChecked: new Date().toISOString(),
            };

            console.log('[Health Check] ✅ Server is healthy:', healthData);
            setHealth(healthData);
        } catch (err) {
            console.error('[Health Check] ❌ Server health check failed:', err.message);

            setHealth({
                isHealthy: false,
                status: 'ERROR',
                timestamp: null,
                uptime: null,
                error: err.message,
                lastChecked: new Date().toISOString(),
            });
        }
    }, []);

    useEffect(() => {
        // Check health immediately on mount
        checkHealth();

        // Set up interval to check every minute (60000ms)
        const intervalId = setInterval(checkHealth, 60000);

        // Cleanup interval on unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [checkHealth]);

    return health;
};
