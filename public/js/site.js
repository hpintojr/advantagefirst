// Global Site JavaScript
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initHamburgerMenu();
    }

    // Hamburger Menu Toggle
    function initHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');

        if (!hamburger || !mobileNav) return;

        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
})();