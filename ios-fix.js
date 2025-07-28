// iOS Safari iframe fix
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    let ticking = false;
    let lastScrollY = window.scrollY;
    let activeCard = null;
    
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Initialize all iframes
    function initIframes() {
        projectCards.forEach(card => {
            const iframe = card.querySelector('iframe');
            const openBtn = card.querySelector('.open-site-btn');
            
            // Set initial styles with smooth transition (0.75 seconds)
            iframe.style.transition = 'height 0.75s ease, opacity 0.75s ease';
            iframe.style.height = '0';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            
            // Handle click on open button
            if (openBtn) {
                openBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    window.open(openBtn.href, '_blank');
                });
            }
        });
    }
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const threshold = 0.3; // 30% of the element needs to be visible
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    }
    
    // Handle scroll events
    function handleScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveCard();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Update which card should be active based on scroll position
    function updateActiveCard() {
        if (!isMobile) return;
        
        let newActiveCard = null;
        let maxVisibility = 0;
        
        // Find the most visible card
        projectCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Calculate visible height of the card
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = visibleHeight / Math.min(rect.height, windowHeight);
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                newActiveCard = card;
            }
        });
        
        // Only update if we found a new active card
        if (newActiveCard && newActiveCard !== activeCard) {
            // Close all iframes first
            projectCards.forEach(card => {
                const iframe = card.querySelector('iframe');
                if (card !== newActiveCard) {
                    iframe.style.height = '0';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                }
            });
            
            // Open the active card's iframe
            if (newActiveCard) {
                const iframe = newActiveCard.querySelector('iframe');
                if (iframe) {
                    iframe.style.height = '300px';
                    iframe.style.opacity = '1';
                    iframe.style.pointerEvents = 'auto';
                }
            }
            
            activeCard = newActiveCard;
        }
    }
    
    // Initialize
    initIframes();
    
    // Add scroll event listener for mobile
    if (isMobile) {
        // Make sure all iframes start closed
        document.querySelectorAll('.project-card iframe').forEach(iframe => {
            iframe.style.height = '0';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
        });
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Don't run initial check to prevent first card from being open
    } else {
        // Desktop behavior - hover/click to toggle
        projectCards.forEach(card => {
            const iframe = card.querySelector('iframe');
            const openBtn = card.querySelector('.open-site-btn');
            
            card.addEventListener('mouseenter', () => {
                if (!isMobile) {
                    iframe.style.height = '300px';
                    iframe.style.opacity = '1';
                    iframe.style.pointerEvents = 'auto';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    iframe.style.height = '0';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                }
            });
            
            // Click behavior for mobile fallback
            card.addEventListener('click', function(e) {
                if (isMobile || e.target === openBtn || (openBtn && openBtn.contains(e.target))) {
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                if (iframe.style.height === '0px' || !iframe.style.height) {
                    iframe.style.height = '300px';
                    iframe.style.opacity = '1';
                    iframe.style.pointerEvents = 'auto';
                } else {
                    iframe.style.height = '0';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                }
            });
        });
    }
});
