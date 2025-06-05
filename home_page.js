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

export function customPlayButton() {
    //CUSTOM PLAY BUTTON
    let player;
    let isPlayerReady = false;

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Create the player when API is ready
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('videoframe', {
            events: {
                onReady: () => {
                    isPlayerReady = true;
                    player.mute(); // Mute so autoplay is allowed
                },
            },
        });
    }

    // Safely bind play button after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const playBtn = document.getElementById('play-btn');

        playBtn.addEventListener('click', () => {
            if (isPlayerReady && player.playVideo) {
                try {
                    player.playVideo(); // Start playing
                } catch (err) {
                    console.error('Play failed:', err);
                }
            }
        });
    });
}

export function initResourcesSwiper() {
    //RESOURCES SLIDER
    const resources_swiper = new Swiper('.resources-swiper', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 16,
        direction: 'horizontal',
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
            992: {
                slidesPerView: 2,
                spaceBetween: 16,
            },
        },

        // Navigation arrows
        navigation: {
            nextEl: '.resources-button-next',
            prevEl: '.resources-button-prev',
        },
    });
}

export function initProjectSwiper() {
    //PROJECT SLIDER
    const project_swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        watchSlidesVisibility: true,
        watchSlidesProgress: true,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
            992: {
                slidesPerView: 2,
                spaceBetween: 32,
            },
        },
    });
}
