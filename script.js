document.addEventListener('DOMContentLoaded', () => {
    // 1. Glatko pomicanje za linkove unutar iste stranice (ako ih ima)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Custom Cursor (Samo za uređaje s mišem)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        const cursorFollower = document.createElement('div');
        cursorFollower.classList.add('cursor-follower');
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorFollower);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Malo kašnjenje za follower
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Efekt na hover linkova, gumba i kartica
        const hoverElements = document.querySelectorAll('a, button, .service-card, .work-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover-active');
            });
        });
    }

    // 3. Carousel Logika
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        let currentIndex = 0;

        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + (slideWidth * currentIndex) + 'px)';
        }

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        // Opcionalno: Automatsko pomicanje svakih 5 sekundi
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
        
        // Osvježi širinu pri promjeni veličine prozora
        window.addEventListener('resize', updateCarousel);
    }

    // 4. Lokalno Vrijeme (Sat)
    function updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('hr-HR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            timeElement.textContent = timeString;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    // 5. Mobile Menu
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    if (header && nav) {
        const menuBtn = document.createElement('button');
        menuBtn.classList.add('mobile-menu-btn');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        header.insertBefore(menuBtn, nav);

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            const icon = menuBtn.querySelector('i');
            if (nav.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    const icon = menuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            });
        });
    }
});
