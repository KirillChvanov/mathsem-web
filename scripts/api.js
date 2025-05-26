// API Service for Mathsem Backend Integration
// Base URL for the backend API
const API_BASE_URL = 'http://localhost:8080/api';

// Utility function to make HTTP requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        // Handle different response statuses
        if (response.status === 404) {
            throw new Error('Resource not found');
        }
        
        if (response.status === 400) {
            throw new Error('Invalid request data');
        }
        
        if (response.status === 500) {
            throw new Error('Server error');
        }

        // For successful DELETE requests (204 No Content)
        if (response.status === 204) {
            return { success: true };
        }

        // Try to parse JSON response
        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        }
        
        return { success: response.ok };
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// User API functions
const UserAPI = {
    // Create new user (registration)
    async register(userData) {
        return makeRequest(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                passwordHash: userData.password // In real app, this should be hashed on frontend
            })
        });
    },

    // Get user by ID
    async getUser(userId) {
        return makeRequest(`${API_BASE_URL}/users/${userId}`);
    },

    // Update user (for account management)
    async updateUser(userId, userData) {
        return makeRequest(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                passwordHash: userData.password
            })
        });
    },

    // Delete user
    async deleteUser(userId) {
        return makeRequest(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
    },

    // Login simulation (since we don't have authentication endpoint)
    // This is a workaround - in real app you'd have /auth/login endpoint
    async login(credentials) {
        // For demo purposes, we'll try to find user by email/username
        // In real app, this would be handled by authentication service
        throw new Error('Login endpoint not implemented in backend');
    }
};

// Reviews API functions
const ReviewAPI = {
    // Create new review
    async createReview(reviewData) {
        return makeRequest(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            body: JSON.stringify({
                user: { id: reviewData.userId },
                reviewText: reviewData.text,
                rating: reviewData.rating
            })
        });
    },

    // Get review by ID
    async getReview(reviewId) {
        return makeRequest(`${API_BASE_URL}/reviews/${reviewId}`);
    },

    // Delete review
    async deleteReview(reviewId) {
        return makeRequest(`${API_BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE'
        });
    },

    // Get all reviews (simulation - backend doesn't have this endpoint)
    // We'll need to modify this approach since there's no "get all" endpoint
    async getAllReviews() {
        // Since backend doesn't have GET /reviews endpoint, 
        // we'll return mock data and suggest backend enhancement
        console.warn('Backend does not have GET /reviews endpoint. Using mock data.');
        return [
            {
                id: 1,
                user: { username: 'deadlyparcourkiller' },
                reviewText: 'Программа просто пушка! я смог разобраться с дискретной математикой с ее помощью. Советую всем студентам',
                rating: 5
            },
            {
                id: 2,
                user: { username: 'brawlstarscrazy2016' },
                reviewText: 'Хороший продукт для учебного прокекта. Желаю успехов в развитии программы!',
                rating: 4
            }
        ];
    }
};

// Files API functions (for future use)
const FileAPI = {
    // Create new file
    async uploadFile(fileData) {
        return makeRequest(`${API_BASE_URL}/files`, {
            method: 'POST',
            body: JSON.stringify({
                user: { id: fileData.userId },
                fileName: fileData.fileName,
                fileData: fileData.fileData // base64 encoded
            })
        });
    },

    // Get file by ID
    async getFile(fileId) {
        return makeRequest(`${API_BASE_URL}/files/${fileId}`);
    },

    // Delete file
    async deleteFile(fileId) {
        return makeRequest(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
    }
};

// Local storage utilities for session management
const SessionManager = {
    setUser(user) {
        localStorage.setItem('mathsem_user', JSON.stringify(user));
    },

    getUser() {
        const userData = localStorage.getItem('mathsem_user');
        return userData ? JSON.parse(userData) : null;
    },

    clearUser() {
        localStorage.removeItem('mathsem_user');
    },

    isLoggedIn() {
        return this.getUser() !== null;
    }
};

// Export for use in other scripts
window.UserAPI = UserAPI;
window.ReviewAPI = ReviewAPI;
window.FileAPI = FileAPI;
window.SessionManager = SessionManager;
