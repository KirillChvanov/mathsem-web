// Reviews management script
document.addEventListener("DOMContentLoaded", async () => {
    const reviewForm = document.getElementById('review-form');
    const submitBtn = document.querySelector('.submit-btn');
    const textarea = document.getElementById('review-textarea');
    const reviewsContainer = document.querySelector('.reviews');
    
    // Validate session on page load
    await validateUserSession();
    
    // Update navigation based on login status
    updateNavigation();
    
    // Load existing reviews
    loadReviews();
    
    // Handle review form submission
    reviewForm.addEventListener('submit', handleReviewSubmission);
    
    // Validate user session with backend
    async function validateUserSession() {
        if (SessionManager.isLoggedIn()) {
            try {
                const isValid = await SessionManager.validateSession();
                if (!isValid) {
                    showMessage('Сессия истекла. Пожалуйста, войдите снова.', 'error');
                }
            } catch (error) {
                console.warn('Session validation error:', error);
                showMessage('Проблема с проверкой сессии.', 'error');
            }
        }
    }
    
    async function handleReviewSubmission(e) {
        e.preventDefault();
        
        // Check if user is logged in and validate session
        if (!SessionManager.isLoggedIn()) {
            showMessage('Войдите в систему, чтобы оставить отзыв', 'error');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return;
        }

        // Validate session with backend before submission
        try {
            const isSessionValid = await SessionManager.validateSession();
            if (!isSessionValid) {
                showMessage('Сессия истекла. Перенаправление на страницу входа...', 'error');
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 2000);
                return;
            }
        } catch (error) {
            showMessage('Ошибка проверки сессии. Попробуйте войти снова.', 'error');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return;
        }
        
        const content = textarea.value.trim();
        if (!content) {
            showMessage('Пожалуйста, введите текст отзыва', 'error');
            return;
        }
        
        if (content.length < 10) {
            showMessage('Отзыв должен содержать минимум 10 символов', 'error');
            return;
        }
        
        const user = SessionManager.getUser();
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            const reviewData = {
                text: content,
                userId: user.id,
                rating: 5 // Default rating
            };
            
            const newReview = await ReviewAPI.createReview(reviewData);
            
            showMessage('Отзыв успешно добавлен!', 'success');
            textarea.value = '';
            
            // Reload all reviews from backend to ensure consistency
            loadReviews();
            
        } catch (error) {
            console.error('Error submitting review:', error);
            showMessage('Ошибка при отправке отзыва. Попробуйте позже.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    }
    
    async function loadReviews() {
        try {
            const reviews = await ReviewAPI.getAllReviews();
            displayReviews(reviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            showMessage('Ошибка при загрузке отзывов', 'error');
        }
    }
    
    function displayReviews(reviews) {
        // Clear existing reviews (keep only static ones if desired)
        reviewsContainer.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>Пока нет отзывов. Будьте первым!</p>';
            return;
        }
        
        // Reverse reviews to show newest first
        const sortedReviews = [...reviews].reverse();
        
        sortedReviews.forEach((review, index) => {
            addReviewToDisplay(review);
            
            // Add separator except for the last review
            if (index < sortedReviews.length - 1) {
                const hr = document.createElement('hr');
                reviewsContainer.appendChild(hr);
            }
        });
    }
    
    function addReviewToDisplay(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        
        // Format date if available
        let dateStr = '';
        if (review.createdAt) {
            const date = new Date(review.createdAt);
            dateStr = ` - ${date.toLocaleDateString('ru-RU')}`;
        }
        
        // Extract username from review object structure
        const username = review.user?.username || review.username || 'Аноним';
        const content = review.reviewText || review.content;
        
        reviewElement.innerHTML = `
            <h4 class="review-author">${escapeHtml(username)}${dateStr}</h4>
            <p class="review-content">${escapeHtml(content)}</p>
        `;
        
        // Simply append the review element
        // Separators are handled by displayReviews function
        reviewsContainer.appendChild(reviewElement);
    }
    
    // updateNavigation is now handled by navigation.js
    
    function showMessage(message, type) {
        const messageSection = document.getElementById('message-section');
        const messageContent = document.getElementById('message-content');
        const messageText = document.getElementById('message-text');
        
        // Remove existing type classes
        messageContent.classList.remove('success', 'error', 'warning', 'info');
        
        // Add new type class
        messageContent.classList.add(type);
        
        // Set message text
        messageText.textContent = message;
        
        // Show message section
        messageSection.style.display = 'block';
        
        // Auto-hide success and info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// Global function to hide message (accessible from HTML onclick)
function hideMessage() {
    const messageSection = document.getElementById('message-section');
    messageSection.classList.add('fade-out');
    
    setTimeout(() => {
        messageSection.style.display = 'none';
        messageSection.classList.remove('fade-out');
    }, 300);
}
