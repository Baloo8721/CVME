// iOS Safari iframe fix with mobile scroll support
document.addEventListener('DOMContentLoaded', function() {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const projectCards = document.querySelectorAll('.project-card');
    let activeCard = null;
    let isScrolling = false;
    let scrollTimeout = null;

    // Function to toggle iframe visibility
    function toggleIframe(card, show) {
        const iframe = card.querySelector('iframe');
        if (!iframe) return;

        if (show) {
            if (activeCard && activeCard !== card) {
                // Collapse previously active card
                toggleIframe(activeCard, false);
            }
            iframe.style.height = '300px';
            iframe.style.opacity = '1';
            iframe.style.pointerEvents = 'auto';
            activeCard = card;
            // Smooth scroll to center the card
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            iframe.style.height = '0';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            if (activeCard === card) {
                activeCard = null;
            }
        }
    }

    // Set up click handlers for all devices
    projectCards.forEach(card => {
        const iframe = card.querySelector('iframe');
        const openBtn = card.querySelector('.open-site-btn');
        
        // Make iframe visible on card tap
        card.addEventListener('click', function(e) {
            // Don't do anything if clicking the open button
            if (e.target === openBtn || openBtn.contains(e.target)) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle iframe visibility
            const isActive = iframe.style.height === '300px';
            toggleIframe(card, !isActive);
        });
        
        // Prevent iframe from capturing touch events when not visible
        iframe.style.pointerEvents = 'none';
    });
    
    // Close all iframes when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card')) {
            projectCards.forEach(card => toggleIframe(card, false));
        }
    });

    // Mobile-specific scroll behavior
    if (isMobile) {
        // Set up intersection observer for auto-expand on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // Trigger when 60% of the card is visible
        };

        const observer = new IntersectionObserver((entries) => {
            // Skip if we're already handling a scroll or click
            if (isScrolling) return;
            
            // Find the most visible card
            let mostVisibleEntry = null;
            let maxVisibility = 0;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
                    mostVisibleEntry = entry;
                    maxVisibility = entry.intersectionRatio;
                }
            });
            
            // If we found a visible card and it's not already active
            if (mostVisibleEntry && mostVisibleEntry.target !== activeCard) {
                isScrolling = true;
                toggleIframe(mostVisibleEntry.target, true);
                
                // Reset scrolling flag after a delay
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        }, observerOptions);

        // Observe all project cards
        projectCards.forEach(card => {
            observer.observe(card);
        });

        // Handle scroll end to reset the scrolling flag
        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 100);
        }, { passive: true });
    }
});
