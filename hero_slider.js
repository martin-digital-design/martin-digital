export function initHeroSlider() {
    const sliderContainers = Array.from(
        document.querySelectorAll('[md-slider="container"]')
    );
    if (sliderContainers.length === 0) return;

    sliderContainers.forEach(container => {
        const slides = Array.from(
            container.querySelectorAll('[md-slider="slide"]')
        );
        const buttons = Array.from(
            container.querySelectorAll('[md-slide-ref]')
        );

        if (slides.length !== buttons.length) {
            console.error('Btns error: mismatch between slides and buttons');
            return;
        }

        const state = {
            current: 0,
            intervalId: null,
        };

        // Hide all but the first slide
        slides.forEach((slide, i) => {
            slide.style.opacity = i === 0 ? '100%' : '0%';
        });
        // Mark first button
        buttons[0].classList.add('current');

        // Start auto-advance
        state.intervalId = startAutoAdvance();

        // Button click handlers
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const ref = parseInt(btn.getAttribute('md-slide-ref'), 10);
                if (isNaN(ref)) {
                    console.error('Btn slide ref error');
                    return;
                }
                if (ref === state.current) {
                    console.error('Same selection');
                    return;
                }

                clearInterval(state.intervalId);
                switchToSlide(ref);
                state.intervalId = startAutoAdvance();
            });
        });

        // Auto-advance function
        function startAutoAdvance() {
            return setInterval(() => {
                const next = (state.current + 1) % slides.length;
                switchToSlide(next);
            }, 3000);
        }

        // Core logic to hide old, show new
        function switchToSlide(newIndex) {
            // hide old
            slides[state.current].style.opacity = '0%';
            buttons[state.current].classList.remove('current');

            // show new
            slides[newIndex].style.opacity = '100%';
            buttons[newIndex].classList.add('current');

            state.current = newIndex;
        }
    });
}
