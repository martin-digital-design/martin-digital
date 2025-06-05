// index.js
export function logInit() {
    console.log('Package running... | Martin Digital :)');
}

export function initNavMobile() {
    //Navbar mobile menu code
    const menu = document.getElementById('nav-menu-icon');

    let open = false;

    menu.addEventListener('click', () => {
        if (open) {
            document.body.style.overflow = 'auto';
            open = !open;
        } else {
            document.body.style.overflow = 'hidden';
            open = !open;
        }
    });
}

export function floatingNavigation() {
    const navbar = document.getElementById('navbar');
    let hasFloating = false;
    let isTransitioning = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (isTransitioning) return; // prevent rapid-fire transitions

        // SCROLL DOWN
        if (scrollY > window.innerHeight && !hasFloating) {
            isTransitioning = true;
            navbar.style.opacity = '0';

            setTimeout(() => {
                navbar.classList.add('floating');
                navbar.style.opacity = '1';
                hasFloating = true;
                isTransitioning = false;
            }, 250);
        }

        // SCROLL UP
        if (scrollY <= window.innerHeight && hasFloating) {
            isTransitioning = true;
            navbar.style.opacity = '0';

            setTimeout(() => {
                navbar.classList.remove('floating');
                navbar.style.opacity = '1';
                hasFloating = false;
                isTransitioning = false;
            }, 250);
        }
    });
}
