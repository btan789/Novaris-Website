(() => {
    const root = document.scrollingElement;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let targetY, positionY, lastScrollY, lastTime;

    function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
    }

    function animate(now) {
        if (Math.abs(window.scrollY - lastScrollY) > 1) {
            stop();
            return;
        }

        // Give wheel steps a longer glide, with a shorter one for reduced motion.
        const easingTime = reducedMotion.matches ? 105 : 150;
        const blend = 1 - Math.exp(-Math.max(0, now - lastTime) / easingTime);
        positionY += (targetY - positionY) * blend;
        lastTime = now;

        const finished = Math.abs(targetY - positionY) < 0.75;
        window.scrollTo({ top: finished ? targetY : positionY, behavior: 'instant' });
        lastScrollY = window.scrollY;
        frame = finished ? 0 : requestAnimationFrame(animate);
    }

    function isWheelStep(event, mode) {
        if (mode !== WheelEvent.DOM_DELTA_PIXEL) return true;

        // Pixel-mode events also come from trackpads. Smooth only likely wheel notches.
        const legacyDelta = event.wheelDeltaY;
        if (legacyDelta && legacyDelta % 120 === 0) return true;
        return Number.isInteger(event.deltaY) && Math.abs(event.deltaY) >= 40;
    }

    function usesNativeScroll(target) {
        if (!(target instanceof Element)) return false;
        if (target.closest('input, textarea, select, [contenteditable], dialog, [role="dialog"], .menu, .glightbox-container')) {
            return true;
        }

        for (let element = target; element && element !== document.body && element !== root; element = element.parentElement) {
            if (element.scrollHeight > element.clientHeight && /^(auto|scroll|overlay)$/.test(getComputedStyle(element).overflowY)) {
                return true;
            }
        }
        return false;
    }

    window.addEventListener('wheel', event => {
        const mode = event.deltaMode;
        if (event.defaultPrevented || !event.cancelable ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
            event.deltaX || !event.deltaY || !isWheelStep(event, mode) ||
            /^(hidden|clip)$/.test(getComputedStyle(document.body).overflowY) ||
            /^(hidden|clip)$/.test(getComputedStyle(root).overflowY) || usesNativeScroll(event.target)) {
            stop();
            return;
        }

        let delta = event.deltaY;
        if (mode === WheelEvent.DOM_DELTA_LINE) delta *= parseFloat(getComputedStyle(document.body).lineHeight) || 16;
        if (mode === WheelEvent.DOM_DELTA_PAGE) delta *= root.clientHeight;

        const actualY = window.scrollY;
        if (frame && Math.abs(actualY - lastScrollY) > 1) stop();

        const continuing = frame && Math.sign(targetY - actualY) === Math.sign(delta);
        const nextY = (continuing ? targetY : actualY) + delta;
        targetY = Math.max(0, Math.min(nextY, root.scrollHeight - root.clientHeight));
        if (targetY === actualY) {
            stop();
            return;
        }

        event.preventDefault();
        if (!frame) {
            positionY = lastScrollY = actualY;
            lastTime = performance.now();
            frame = requestAnimationFrame(animate);
        }
    }, { passive: false });

    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('pagehide', stop);
})();
