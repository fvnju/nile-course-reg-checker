import type { RegistrationData } from './api.types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function checkCourseRegistration(studentId: string, password: string): Promise<RegistrationData> {
  if (!SERVER_URL) {
    throw new Error('VITE_SERVER_URL is not defined in environment variables');
  }

  try {
    const response = await fetch(`${SERVER_URL}/course-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, password }),
    });

    if (!response.ok) {
        // Try to parse error message from body if available
        let errorMessage = 'Failed to check registration';
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.message) {
                errorMessage = errorBody.message;
            }
        } catch (e) {
            // Ignore JSON parse error, use default message
        }
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();
    return data as RegistrationData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('API Error:', error);
    throw new Error('An unexpected error occurred while checking registration');
  }
}
