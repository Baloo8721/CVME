// iOS Safari iframe fix
document.addEventListener('DOMContentLoaded', function() {
    // Check if the device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
        const projectCards = document.querySelectorAll('.project-card');
        
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
            
            // Prevent iframe from capturing touch events when not visible
            iframe.style.pointerEvents = 'none';
        });
        
        // Close all iframes when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.project-card')) {
                document.querySelectorAll('.project-card iframe').forEach(iframe => {
                    iframe.style.height = '0';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                });
            }
        });
    }
});
