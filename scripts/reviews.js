// Reviews management script
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.querySelector('.submit-btn');
    const textarea = document.querySelector('textarea');
    const reviewsContainer = document.querySelector('.reviews');
    
    // Update navigation based on login status
    updateNavigation();
    
    // Load existing reviews
    loadReviews();
    
    // Handle review submission
    submitBtn.addEventListener('click', handleReviewSubmission);
    
    async function handleReviewSubmission(e) {
        e.preventDefault();
        
        // Check if user is logged in
        if (!SessionManager.isLoggedIn()) {
            showMessage('Войдите в систему, чтобы оставить отзыв', 'error');
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
        
        const user = SessionManager.getUser();
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            const reviewData = {
                content: content,
                userId: user.id
            };
            
            const response = await ReviewAPI.createReview(reviewData);
            
            if (response.ok) {
                const newReview = await response.json();
                showMessage('Отзыв успешно добавлен!', 'success');
                textarea.value = '';
                
                // Add the new review to the display
                addReviewToDisplay({
                    ...newReview,
                    username: user.username
                });
            } else {
                const errorData = await response.json();
                showMessage(errorData.message || 'Ошибка при добавлении отзыва', 'error');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showMessage('Ошибка при отправке отзыва', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    }
    
    async function loadReviews() {
        try {
            const response = await ReviewAPI.getAllReviews();
            
            if (response.ok) {
                const reviews = await response.json();
                displayReviews(reviews);
            } else {
                console.error('Failed to load reviews');
                showMessage('Ошибка при загрузке отзывов', 'error');
            }
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
        
        reviews.forEach((review, index) => {
            addReviewToDisplay(review);
            
            // Add separator except for the last review
            if (index < reviews.length - 1) {
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
        
        reviewElement.innerHTML = `
            <h4 class="review-author">${escapeHtml(review.username || 'Аноним')}${dateStr}</h4>
            <p class="review-content">${escapeHtml(review.content)}</p>
        `;
        
        // If there are existing reviews, add to the beginning
        if (reviewsContainer.firstChild) {
            reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);
            
            // Add separator
            const hr = document.createElement('hr');
            reviewsContainer.insertBefore(hr, reviewElement.nextSibling);
        } else {
            reviewsContainer.appendChild(reviewElement);
        }
    }
    
    // updateNavigation is now handled by navigation.js
    
    function showMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        
        // Insert message after the first section part
        const firstPart = document.getElementById('first-part');
        firstPart.parentNode.insertBefore(messageElement, firstPart.nextSibling);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
