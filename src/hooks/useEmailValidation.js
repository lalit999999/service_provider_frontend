import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/endpoints';

/**
 * Custom hook for real-time email validation with debouncing
 * @param {string} email - The email address to validate
 * @param {number} delay - Debounce delay in milliseconds (default: 800ms)
 * @returns {object} - Validation state object
 */
export const useEmailValidation = (email, delay = 800) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [error, setError] = useState(null);

    const validateEmail = useCallback(async (emailToValidate) => {
        if (!emailToValidate || emailToValidate.trim() === '') {
            setValidationResult(null);
            setError(null);
            return;
        }

        // Basic format check first (client-side)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailToValidate)) {
            setValidationResult({ valid: false, message: 'Invalid email format' });
            setIsValidating(false);
            return;
        }

        setIsValidating(true);
        setError(null);

        try {
            const response = await authAPI.validateEmail(emailToValidate);
            setValidationResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to validate email');
            setValidationResult(null);
        } finally {
            setIsValidating(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            validateEmail(email);
        }, delay);

        return () => clearTimeout(timer);
    }, [email, delay, validateEmail]);

    return {
        isValidating,
        validationResult,
        error,
        isValid: validationResult?.valid === true,
        isInvalid: validationResult?.valid === false,
        message: validationResult?.message || error,
    };
};
