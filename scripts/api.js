// API Service for Mathsem Backend Integration
// Base URL for the backend API
// const API_BASE_URL = 'http://194.87.234.38:8080/api';
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
            const data = await response.json();
            return data;
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
                passwordHash: userData.password
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
        try {
            // Try known user IDs to find matching credentials
            const knownUserIds = [1, 2, 3, 4, 5]; // Try first 5 users
            
            for (const userId of knownUserIds) {
                try {
                    const user = await this.getUser(userId);
                    if (user && (user.username === credentials.username || user.email === credentials.username)) {
                        // In a real app, you'd verify the password hash here
                        // For demo, we'll accept any password
                        return {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        };
                    }
                } catch (error) {
                    // User doesn't exist, continue checking
                    continue;
                }
            }
            
            throw new Error('Неверные учетные данные');
        } catch (error) {
            throw new Error('Ошибка при входе в систему');
        }
    },

    // Validate user session by checking if user still exists
    async validateSession(userId) {
        try {
            const user = await this.getUser(userId);
            return {
                id: user.id,
                username: user.username,
                email: user.email
            };
        } catch (error) {
            throw new Error('Сессия недействительна');
        }
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
                rating: reviewData.rating || 5
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

    // Get all reviews from backend
    async getAllReviews() {
        try {
            return await makeRequest(`${API_BASE_URL}/reviews`);
        } catch (error) {
            console.error('Failed to fetch reviews from backend:', error);
            // Fallback to static reviews if backend is unavailable
            return [
                {
                    id: 1,
                    user: { username: 'deadlyparcourkiller' },
                    reviewText: 'Программа просто пушка! я смог разобраться с дискретной математикой с ее помощью. Советую всем студентам',
                    rating: 5,
                    createdAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    user: { username: 'brawlstarscrazy2016' },
                    reviewText: 'Хороший продукт для учебного прокекта. Желаю успехов в развитии программы!',
                    rating: 4,
                    createdAt: '2024-01-10T14:20:00Z'
                },
                {
                    id: 3,
                    user: { username: 'blabla' },
                    reviewText: 'Пользуюсь программой для изучения дискретной математики. Очень помогает.',
                    rating: 5,
                    createdAt: '2024-01-05T09:15:00Z'
                }
            ];
        }
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
    },

    // Validate current session against backend
    async validateSession() {
        const user = this.getUser();
        if (!user || !user.id) {
            this.clearUser();
            return false;
        }

        try {
            const validatedUser = await UserAPI.validateSession(user.id);
            // Update user data in case it changed
            this.setUser(validatedUser);
            return true;
        } catch (error) {
            console.warn('Session validation failed:', error.message);
            this.clearUser();
            return false;
        }
    }
};

// Export for use in other scripts
window.UserAPI = UserAPI;
window.ReviewAPI = ReviewAPI;
window.FileAPI = FileAPI;
window.SessionManager = SessionManager;
