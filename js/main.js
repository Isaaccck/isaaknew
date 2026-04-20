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
       3. Image Carousel Logic
    ------------------------------------------- */
    const carousel = document.getElementById("carousel");
    const images = document.querySelectorAll(".carousel-img");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    let timer;
    const interval = 3000; // 3 seconds

    function showImage(index) {
        // Remove active class from all
        images.forEach(img => img.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        // Add active class to current
        images[index].classList.add("active");
        dots[index].classList.add("active");
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // Start auto-slide
    function startTimer() {
        timer = setInterval(nextImage, interval);
    }

    // Reset timer on manual interaction
    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    // Click on the carousel to switch to next immediately
    carousel.addEventListener("click", () => {
        nextImage();
        resetTimer();
    });

    startTimer(); // Initialize

    /* -------------------------------------------
       4. Scroll Animations (Intersection Observer)
    ------------------------------------------- */
    const animateElements = document.querySelectorAll('.fade-in-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
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
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 8; // Adjust divisor for sensitivity
            const deltaY = (y - centerY) / 8;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

});
