/* Gallery page: lightbox and staggered reveal of the photo grid. */
(() => {
    GLightbox({
        touchNavigation: true,
        loop: true,
        zoomable: true,
        draggable: true,
        openEffect: 'zoom',
        closeEffect: 'fade'
    });

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }, { threshold: 0.05 });

    document.querySelectorAll('.gallery a').forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.06}s`;
        observer.observe(link);
    });
})();
