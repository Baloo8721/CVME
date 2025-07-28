document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile touch for project cards
    const projectCards = document.querySelectorAll('.project-card');
    let activeCard = null;
    let touchStartY = 0;
    let touchEndY = 0;
    const TOUCH_THRESHOLD = 10; // Minimum pixels to consider it a scroll

    // Handle touch start
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    // Handle touch end
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = Math.abs(touchEndY - touchStartY);
        
        // If it's a significant vertical movement, treat it as a scroll
        if (touchDiff > TOUCH_THRESHOLD) {
            // Collapse any open card when scrolling
            if (activeCard) {
                activeCard.classList.remove('active');
                activeCard = null;
            }
            return;
        }

        // Toggle the clicked card
        const clickedCard = e.target.closest('.project-card');
        if (!clickedCard) return;

        // If clicking the same card, toggle it
        if (activeCard === clickedCard) {
            clickedCard.classList.remove('active');
            activeCard = null;
        } else {
            // Close any other open card
            if (activeCard) {
                activeCard.classList.remove('active');
            }
            // Open the clicked card
            clickedCard.classList.add('active');
            activeCard = clickedCard;
        }
    }

    // Close card when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card') && activeCard) {
            activeCard.classList.remove('active');
            activeCard = null;
        }
    }, true);

    // Add event listeners
    projectCards.forEach(card => {
        // Prevent default touch behavior
        card.addEventListener('touchend', function(e) {
            // Only prevent default if not clicking a link or button
            if (!e.target.closest('a, button, input, [role="button"]')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchend', handleTouchEnd, { passive: true });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Clear any existing timer
        clearTimeout(resizeTimer);
        
        // Set a new timer to run after resize is complete
        resizeTimer = setTimeout(function() {
            // Close any open cards on resize (helps with orientation changes)
            if (activeCard) {
                activeCard.classList.remove('active');
                activeCard = null;
            }
        }, 250);
    });
});
