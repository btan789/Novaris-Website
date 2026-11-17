/* Home page hero: mouse tilt and scroll parallax. */
(() => {
    const hero = document.querySelector('.hero-tilt');
    const background = document.querySelector('.hero-bg');
    const bottomBar = document.querySelector('.container-bottom');
    if (!hero || !background || !bottomBar) return;

    const MOUSE_SHIFT = 12;   // px the background follows the pointer
    const MAX_TILT = 4;       // degrees
    const MAX_BLUR = 3;       // px, reached as the hero scrolls away
    const EASE_PER_FRAME = 0.08;

    let mouseX = 0, mouseY = 0;   // pointer position, -0.5 .. 0.5 from the centre
    let easedX = 0, easedY = 0;
    let frame = 0, lastTime = 0, lastBlur = -1;

    function render(now) {
        // Same easing as 0.08 per frame at 60fps, whatever the display's refresh rate.
        const blend = 1 - Math.pow(1 - EASE_PER_FRAME, Math.min(now - lastTime, 100) / (1000 / 60));
        lastTime = now;
        easedX += (mouseX - easedX) * blend;
        easedY += (mouseY - easedY) * blend;

        const shiftX = easedX * MOUSE_SHIFT;
        const shiftY = easedY * MOUSE_SHIFT;
        const scroll = window.scrollY * 0.85;

        background.style.transform = `translate3d(${shiftX}px, ${shiftY + scroll * 0.25}px, 0) scale(1.1)`;
        bottomBar.style.transform = `translate3d(${shiftX * 0.4}px, ${shiftY * 0.4 + scroll * 0.55}px, 0)`;
        hero.style.transform =
            `perspective(1000px) rotateX(${easedY * -MAX_TILT}deg) rotateY(${easedX * MAX_TILT}deg)`;

        // Only touch the (expensive) filter when the blur amount actually changes.
        const blur = Math.round(Math.min(window.scrollY * 0.015, MAX_BLUR) * 10) / 10;
        if (blur !== lastBlur) {
            background.style.filter = blur ? `blur(${blur}px)` : 'none';
            lastBlur = blur;
        }

        frame = requestAnimationFrame(render);
    }

    window.addEventListener('mousemove', event => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    // Animate only while the hero is on screen.
    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !frame) {
            lastTime = performance.now();
            frame = requestAnimationFrame(render);
        } else if (!entry.isIntersecting && frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
    }).observe(hero);
})();
