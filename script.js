// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// // Smooth scrolling for navigation links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             target.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });

// // Smooth scrolling with navbar offset
// const navbar = document.querySelector('.navbar');
// const NAV_H = navbar ? navbar.offsetHeight : 72;

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//   anchor.addEventListener('click', function (e) {
//     const target = document.querySelector(this.getAttribute('href'));
//     if (!target) return;
//     e.preventDefault();
//     const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 10;
//     window.scrollTo({ top, behavior: 'smooth' });
//   });
// });

// Smooth-scrolling nav offset (keep this if you use it)
const navbar = document.querySelector('.navbar');
const NAV_H = navbar ? navbar.offsetHeight : 72;

// Parallax (capped to avoid aggressive overlap)
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (!hero) return;
  const y = Math.min(window.pageYOffset * 0.5, 150);  // cap at 150px
  hero.style.transform = `translateY(${y}px)`;
});


// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.research-card, .project-card, .publication-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-text h1');
//     if (heroTitle) {
//         const originalText = heroTitle.innerHTML;
//         setTimeout(() => {
//             typeWriter(heroTitle, originalText, 50);
//         }, 500);
//     }
// });
// HTML-aware typewriter: preserves tags, types only text
function typeHtml(element, html, speed = 50) {
  let i = 0;
  element.innerHTML = '';

  (function type() {
    if (i >= html.length) return;

    if (html[i] === '<') {
      // append the whole tag at once
      const end = html.indexOf('>', i);
      element.innerHTML += html.slice(i, end + 1);
      i = end + 1;
      // no delay bump here; continue immediately to keep pace
      type();
    } else {
      // append one visible character
      element.innerHTML += html[i];
      i++;
      setTimeout(type, speed);
    }
  })();
}

document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-text h1');
  if (heroTitle) {
    const html = heroTitle.innerHTML; // includes your <span class="highlight">Lingli</span>
    setTimeout(() => typeHtml(heroTitle, html, 50), 500);
  }
});

// document.addEventListener('DOMContentLoaded', () => {
//   const nameSpan = document.getElementById('name');
//   if (!nameSpan) return;
//   const full = nameSpan.textContent;
//   nameSpan.textContent = '';
//   let i = 0;
//   (function type(){
//     if (i >= full.length) return;
//     nameSpan.textContent += full[i++];
//     setTimeout(type, 80);
//   })();
// });


// Add active class to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// // Parallax effect for hero section
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Parallax (capped)
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const y = Math.min(window.pageYOffset * 0.5, 150); // cap at 150px
  hero.style.transform = `translateY(${y}px)`;
});


// Abstract toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const abstractToggles = document.querySelectorAll('.abstract-toggle');
    
    abstractToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const abstractDiv = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            
            // Toggle the abstract visibility
            if (abstractDiv.classList.contains('active')) {
                abstractDiv.classList.remove('active');
                toggle.classList.remove('active');
                toggle.innerHTML = '<i class="fas fa-chevron-down"></i> Abstract';
            } else {
                // Close other open abstracts
                document.querySelectorAll('.publication-abstract.active').forEach(abs => {
                    abs.classList.remove('active');
                });
                document.querySelectorAll('.abstract-toggle.active').forEach(btn => {
                    btn.classList.remove('active');
                    btn.innerHTML = '<i class="fas fa-chevron-down"></i> Abstract';
                });
                
                // Open clicked abstract
                abstractDiv.classList.add('active');
                toggle.classList.add('active');
                toggle.innerHTML = '<i class="fas fa-chevron-up"></i> Abstract';
            }
        });
    });
});

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #2563eb !important;
        position: relative;
    }
    
    .nav-menu a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #2563eb;
    }
`;
document.head.appendChild(style);