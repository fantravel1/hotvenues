/* ============================================================
   HOTVENUES — Script
   Navigation, scroll effects, animations, mobile menu
   ============================================================ */

(function () {
    'use strict';

    // --- DOM Elements ---
    var nav = document.getElementById('nav');
    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    var navLinks = document.getElementById('navLinks');

    // --- Scroll: Nav background ---
    var lastScroll = 0;
    var ticking = false;

    function onScroll() {
        lastScroll = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }

    function updateNav() {
        if (!nav) { ticking = false; return; }
        if (lastScroll > 40) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Mobile Menu Toggle ---
    if (navBurger && mobileMenu) {
        navBurger.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.contains('mobile-menu--open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on link click
        var menuLinks = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', closeMenu);
        }

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
                closeMenu();
            }
        });
    }

    function openMenu() {
        mobileMenu.classList.add('mobile-menu--open');
        navBurger.classList.add('nav__burger--open');
        navBurger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('mobile-menu--open');
        navBurger.classList.remove('nav__burger--open');
        navBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // --- Scroll Reveal Animation ---
    var revealElements = document.querySelectorAll(
        '.venue-card, .metric-card, .list-card, .city-card, .trust__block, .faq__item, .section-header, .manifesto__inner'
    );

    if ('IntersectionObserver' in window && revealElements.length) {
        // Add initial hidden state
        for (var j = 0; j < revealElements.length; j++) {
            revealElements[j].style.opacity = '0';
            revealElements[j].style.transform = 'translateY(30px)';
            revealElements[j].style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        }

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger delay based on index within parent
                    var parent = entry.target.parentElement;
                    var siblings = parent ? parent.children : [];
                    var index = 0;
                    for (var k = 0; k < siblings.length; k++) {
                        if (siblings[k] === entry.target) { index = k; break; }
                    }
                    var delay = Math.min(index * 80, 400);

                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);

                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        for (var m = 0; m < revealElements.length; m++) {
            revealObserver.observe(revealElements[m]);
        }
    }

    // --- Smooth scroll for anchor links ---
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (var n = 0; n < anchorLinks.length; n++) {
        anchorLinks[n].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = nav ? nav.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    // --- HOT Score counter animation ---
    var scoreElements = document.querySelectorAll('.venue-card__score-num');

    if ('IntersectionObserver' in window && scoreElements.length) {
        var scoreObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateScore(entry.target);
                    scoreObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        for (var p = 0; p < scoreElements.length; p++) {
            scoreObserver.observe(scoreElements[p]);
        }
    }

    function animateScore(el) {
        var target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        var start = 0;
        var duration = 1200;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    // --- Prefers reduced motion check ---
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Show all elements immediately
        for (var q = 0; q < revealElements.length; q++) {
            revealElements[q].style.opacity = '1';
            revealElements[q].style.transform = 'none';
            revealElements[q].style.transition = 'none';
        }
    }

})();
