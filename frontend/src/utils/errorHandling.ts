import { ApiError } from '../types/errors';

/**
 * Extract error message from API error
 * @param error The caught API error
 * @param defaultMessage Default message to show if error doesn't contain a message
 * @returns Formatted error message string
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  // If it's already a string, return it
  if (typeof error === 'string') return error;
  
  // Handle our ApiError type
  const apiError = error as ApiError;
  
  return (
    apiError.response?.data?.message || 
    apiError.message || 
    defaultMessage
  );
};

/**
 * Wrap async functions with standardized error handling
 * @param asyncFn The async function to execute
 * @param onError Optional callback for error handling
 * @returns Result of the async function or throws a standardized error
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  onError?: (error: string) => void
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (onError) {
      onError(errorMessage);
    }
    throw new Error(errorMessage);
  }
};

/**
 * Handle API errors with loading state and error state
 * @param asyncFn Async function to execute
 * @param setLoading Loading state setter
 * @param setError Error state setter
 * @returns Result of the async function or null if error
 */
export const handleApiRequest = async <T>(
  asyncFn: () => Promise<T>,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<T | null> => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await asyncFn();
    return result;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    setError(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
}; 