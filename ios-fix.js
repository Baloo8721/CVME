// Mobile-optimized iframe handling with auto-expand on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const projectCards = document.querySelectorAll('.project-card');
    let activeCard = null;
    let isScrolling = false;
    let scrollTimeout = null;
    let lastScrollTop = 0;
    let touchStartY = 0;

    // Function to toggle iframe visibility
    function toggleIframe(card, show, isAutoScroll = false) {
        const iframe = card.querySelector('iframe');
        if (!iframe) return;

        if (show) {
            // Don't auto-expand if user just clicked/tapped (not scrolling)
            if (isAutoScroll && isScrolling === false) {
                return;
            }
            
            if (activeCard && activeCard !== card) {
                // Collapse previously active card
                const prevIframe = activeCard.querySelector('iframe');
                if (prevIframe) {
                    prevIframe.style.height = '0';
                    prevIframe.style.opacity = '0';
                    prevIframe.style.pointerEvents = 'none';
                }
            }
            
            iframe.style.height = '300px';
            iframe.style.opacity = '1';
            iframe.style.pointerEvents = 'auto';
            activeCard = card;
            
            // Only auto-scroll if this was triggered by scrolling
            if (isAutoScroll) {
                const scrollOptions = {
                    behavior: 'smooth',
                    block: 'center'
                };
                // Use a small timeout to prevent scroll jank
                setTimeout(() => {
                    card.scrollIntoView(scrollOptions);
                }, 50);
            }
        } else {
            iframe.style.height = '0';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            if (activeCard === card) {
                activeCard = null;
            }
        }
    }

    // Set up touch/click handlers for all devices
    projectCards.forEach(card => {
        const iframe = card.querySelector('iframe');
        const openBtn = card.querySelector('.open-site-btn');
        
        // Track touch start position
        card.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        // Handle card tap/click
        card.addEventListener('click', function(e) {
            // Don't do anything if clicking the open button
            if (e.target === openBtn || openBtn.contains(e.target)) {
                return;
            }
            
            // Check if this was a vertical swipe (not a tap)
            const touchEndY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            if (Math.abs(touchEndY - touchStartY) > 10) {
                return; // Ignore if vertical movement was significant
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle iframe visibility
            const isActive = iframe.style.height === '300px';
            toggleIframe(card, !isActive, false);
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
            threshold: 0.7 // Slightly higher threshold for better mobile experience
        };

        const observer = new IntersectionObserver((entries) => {
            // Skip if we're already handling a scroll
            if (!isScrolling) return;
            
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
            if (mostVisibleEntry && mostVisibleEntry.target !== activeCard && maxVisibility > 0.6) {
                toggleIframe(mostVisibleEntry.target, true, true);
            }
        }, observerOptions);

        // Observe all project cards
        projectCards.forEach(card => {
            observer.observe(card);
        });

        // Handle scroll events
        let lastScrollTime = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            // Only process scroll events at most once every 50ms
            if (now - lastScrollTime < 50) return;
            lastScrollTime = now;
            
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = currentScroll > lastScrollTop;
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            
            // Set scrolling flag
            isScrolling = true;
            
            // Clear any pending timeouts
            clearTimeout(scrollTimeout);
            
            // Reset scrolling flag after scroll ends
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
            
        }, { passive: true });
    }
});
