// DOM 요소들
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const skillBars = document.querySelectorAll('.skill-progress');
const typewriterElement = document.querySelector('.typewriter');
const cursorGlow = document.querySelector('.cursor-glow');
const dropdown = document.querySelector('.dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');

// 타이핑 애니메이션
class TypeWriter {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts.split('|');
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed = this.deleteSpeed;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// 타이핑 애니메이션 시작
if (typewriterElement) {
    const texts = typewriterElement.getAttribute('data-text');
    new TypeWriter(typewriterElement, texts);
}

// 햄버거 메뉴 토글
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 네비게이션 링크 클릭 시 메뉴 닫기
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 드롭다운 메뉴 기능 (모바일에서 클릭으로 작동)
if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
}

// 부드러운 스크롤
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // 외부 링크는 건너뛰기
        if (link.getAttribute('href').includes('.html') || link.getAttribute('href') === '#') {
            return;
        }
        
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 스크롤 이벤트 핸들러
window.addEventListener('scroll', () => {
    // 네비게이션 바 배경 변경
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }

    // 스킬바 애니메이션
    animateSkillBars();
    
    // 페이드 인 애니메이션
    animateOnScroll();
});

// 스킬바 애니메이션
function animateSkillBars() {
    const skillsSection = document.querySelector('.skills');
    const sectionTop = skillsSection.offsetTop;
    const sectionHeight = skillsSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    if (scrollY > sectionTop - windowHeight / 2 && scrollY < sectionTop + sectionHeight) {
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }
}

// 스크롤 시 요소들 페이드 인
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .about-text, .contact-info');
    
    elements.forEach(element => {
        const elementTop = element.offsetTop;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        if (scrollY > elementTop - windowHeight + 100) {
            element.classList.add('fade-in-up');
        }
    });
}

// 커서 글로우 효과
document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX - 10 + 'px';
        cursorGlow.style.top = e.clientY - 10 + 'px';
    }
});

// 연락처 폼 처리
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(contactForm);
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;
        
        // 간단한 유효성 검사
        if (!name || !email || !message) {
            showNotification('모든 필드를 입력해주세요.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // 성공 메시지 표시
        showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
        contactForm.reset();
    });
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 알림 메시지 표시
function showNotification(message, type = 'success') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 스타일 추가
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// CSS 애니메이션 추가 (동적으로)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 초기 스크롤 위치에서 애니메이션 체크
    animateOnScroll();
    
    // 스킬바 초기 상태 설정
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
    
    // 로딩 애니메이션
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// 인터섹션 옵저버를 사용한 성능 최적화된 애니메이션
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // 스킬바 특별 처리
                if (entry.target.classList.contains('skills')) {
                    setTimeout(() => {
                        skillBars.forEach(bar => {
                            const progress = bar.getAttribute('data-progress');
                            bar.style.width = progress + '%';
                        });
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들 등록
    const elementsToAnimate = document.querySelectorAll('.skill-category, .project-card, .about-text, .contact-info, .skills');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// 테마 전환 기능 (향후 확장용)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// 저장된 테마 적용
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

// 프로젝트 카드 호버 효과 개선
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// 부드러운 스크롤 인디케이터
function updateScrollIndicator() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    let indicator = document.querySelector('.scroll-progress');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'scroll-progress';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(indicator);
    }
    
    indicator.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollIndicator);

// 게임 개발 관련 특수 효과
const particles = [];
const particleCanvas = document.createElement('canvas');
const particleCtx = particleCanvas.getContext('2d');

function initParticles() {
    particleCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.1;
    `;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    document.body.appendChild(particleCanvas);
    
    // 파티클 생성
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
        });
    }
    
    animateParticles();
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x > particleCanvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = particleCanvas.width;
        if (particle.y > particleCanvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = particleCanvas.height;
        
        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        particleCtx.fillStyle = particle.color;
        particleCtx.fill();
    });
    
    requestAnimationFrame(animateParticles);
}

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', () => {
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
});

// 파티클 효과 초기화 (성능을 위해 데스크톱에서만)
if (window.innerWidth > 768) {
    setTimeout(initParticles, 1000);
} 