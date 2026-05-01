document.addEventListener("DOMContentLoaded", () => {
    /* -------------------------------------------
       1. Set current year in footer
    ------------------------------------------- */
    document.getElementById("year").textContent = new Date().getFullYear();

    /* -------------------------------------------
       2. Header Scroll Effect
    ------------------------------------------- */
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* -------------------------------------------
       3. Image Carousel Logic (Swipe + Auto)
    ------------------------------------------- */
    const carousel = document.getElementById("carousel");
    const images = document.querySelectorAll(".carousel-img");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    let timer;
    const interval = 3000;
    let isAnimating = false;

    // Touch / pointer tracking
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    const swipeThreshold = 40;

    function showImage(index, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const prev = document.querySelector(".carousel-img.active");
        const next = images[index];

        // Update dots
        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");

        if (prev === next) {
            isAnimating = false;
            return;
        }

        // Determine animation classes based on swipe direction
        // direction: 'left' means next image, 'right' means previous
        const outClass = direction === 'left' ? 'swipe-left' : 'swipe-right';
        const inClass = direction === 'left' ? 'swipe-in-left' : 'swipe-in-right';

        // Prepare next image
        next.style.opacity = '0';
        next.style.transform = 'none';
        next.classList.add('active');
        next.classList.add(inClass);

        // Animate out current
        prev.classList.add(outClass);

        // After animation finishes, clean up
        const onEnd = () => {
            prev.classList.remove('active', outClass);
            prev.style.opacity = '';
            prev.style.transform = '';
            next.classList.remove(inClass);
            next.style.opacity = '';
            next.style.transform = '';
            isAnimating = false;
        };

        setTimeout(onEnd, 460);
    }

    function nextImage() {
        const next = (currentIndex + 1) % images.length;
        showImage(next, 'left');
        currentIndex = next;
    }

    function prevImage() {
        const prev = (currentIndex - 1 + images.length) % images.length;
        showImage(prev, 'right');
        currentIndex = prev;
    }

    // Auto-slide
    function startTimer() {
        timer = setInterval(nextImage, interval);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    // --- Touch events ---
    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
        // Intentionally left empty; we only care about start/end
    }, { passive: true });

    carousel.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;

        // Only register horizontal swipe if it's more horizontal than vertical
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
                nextImage(); // swipe left → next
            } else {
                prevImage(); // swipe right → previous
            }
            resetTimer();
        }
    });

    // --- Mouse drag events (desktop) ---
    carousel.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener("mouseup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;

        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
                nextImage();
            } else {
                prevImage();
            }
            resetTimer();
        }
    });

    // Prevent image drag ghost
    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    startTimer();

    /* -------------------------------------------
       4. Scroll Animations (Intersection Observer)
    ------------------------------------------- */
    const animateElements = document.querySelectorAll('.fade-in-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animateElements.forEach((el) => {
        observer.observe(el);
    });

    /* -------------------------------------------
       5. Magnetic Button Effect
    ------------------------------------------- */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 8;
            const deltaY = (y - centerY) / 8;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

});
