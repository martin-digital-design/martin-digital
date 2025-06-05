// index.js
export function logInit() {
    console.log('Package running... | Martin Digital :)');
}

export function initTestimonialSlider() {
    //TESTIMONIAL SLIDER
    const sliders = document.querySelectorAll('.testimonial-container');
    const SIZE_ACTIVATION_DELAY = 500; // milliseconds

    function activateSlide(index) {
        const clicked = sliders[index];
        const current = document.querySelector('.testimonial-container.active');
        if (clicked === current) return;

        // Handle previous
        if (current) {
            const prevSize = current.querySelector(
                '.testimonial-container-size'
            );
            if (prevSize) prevSize.classList.remove('active');

            current.classList.remove('active');
            clicked.classList.add('active');
            const clickedSize = clicked.querySelector(
                '.testimonial-container-size'
            );

            setTimeout(() => {
                if (clickedSize) {
                    clickedSize.classList.add('active');
                }
            }, SIZE_ACTIVATION_DELAY);
        } else {
            // If no active slide, activate directly
            clicked.classList.add('active');
            const clickedSize = clicked.querySelector(
                '.testimonial-container-size'
            );
            if (clickedSize) {
                setTimeout(() => {
                    clickedSize.classList.add('active');
                }, SIZE_ACTIVATION_DELAY);
            }
        }
    }

    // Click handling for each slide
    sliders.forEach((slider, index) => {
        slider.addEventListener('click', () => activateSlide(index));
    });

    // Navigation buttons
    const nextBtn = document.querySelector('[data-testimonial="next"]');
    const prevBtn = document.querySelector('[data-testimonial="prev"]');

    function getCurrentIndex() {
        return [...sliders].findIndex(slide =>
            slide.classList.contains('active')
        );
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentIndex = getCurrentIndex();
            const nextIndex = (currentIndex + 1) % sliders.length;
            activateSlide(nextIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentIndex = getCurrentIndex();
            const prevIndex =
                (currentIndex - 1 + sliders.length) % sliders.length;
            activateSlide(prevIndex);
        });
    }
}
