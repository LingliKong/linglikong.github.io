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
        
        // Open email client with pre-filled message
        const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:llkong1102@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        window.location.href = mailtoLink;
        
        // Show success message
        setTimeout(() => {
            alert('Your email client should have opened. If not, please email me directly at llkong1102@gmail.com');
            this.reset();
        }, 1000);
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

// Function to initialize animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.research-card, .project-card, .publication-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

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

// Function to initialize hero typing animation
function initializeHeroAnimation() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const html = heroTitle.innerHTML;
        setTimeout(() => typeHtml(heroTitle, html, 50), 500);
    }
}

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


// This function is now handled by the PublicationRenderer

// Global publication renderer instance
let publicationRenderer;

// Main initialization - consolidate all DOMContentLoaded listeners
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing website...');
    
    // Initialize hero animation
    initializeHeroAnimation();
    
    // Initialize publications with simpler approach
    try {
        console.log('Creating PublicationRenderer...');
        publicationRenderer = new PublicationRenderer();
        
        console.log('Initializing renderer...');
        const success = await publicationRenderer.initialize();
        
        if (success) {
            console.log(`Loaded ${Object.keys(publicationRenderer.entries).length} publications`);
            publicationRenderer.renderPublications();
            console.log('Publications rendered successfully');
            
            // Initialize animations after publications are rendered
            setTimeout(() => {
                initializeAnimations();
            }, 100);
        } else {
            document.getElementById('publications-container').innerHTML = 
                '<p style="color: red;">Failed to load publications. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error initializing publications:', error);
        document.getElementById('publications-container').innerHTML = 
            `<p style="color: red;">Error loading publications: ${error.message}</p>`;
    }
    
    // Initialize citation modal
    initializeCitationModal();
    
    console.log('Website initialization complete');
});



// Citation modal functionality
function initializeCitationModal() {
    const modal = document.getElementById('citation-modal');
    const citationText = document.getElementById('citation-text');
    const copyBtn = document.getElementById('copy-citation');
    const closeBtn = document.querySelector('.citation-close');
    const citationTabs = document.querySelectorAll('.citation-tab');
    
    let currentCitationId = '';
    let currentFormat = 'bibtex';
    
    // Open citation modal - use event delegation for dynamically created buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cite-btn')) {
            const btn = e.target.closest('.cite-btn');
            e.preventDefault();
            currentCitationId = btn.getAttribute('data-target');
            currentFormat = 'bibtex';
            
            // Reset tabs
            citationTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector('[data-format="bibtex"]').classList.add('active');
            
            showCitation();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Citation format tabs
    citationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            citationTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFormat = tab.getAttribute('data-format');
            showCitation();
        });
    });
    
    // Show citation based on current format
    function showCitation() {
        if (!publicationRenderer) {
            citationText.textContent = 'Loading citation data...';
            return;
        }

        const citation = publicationRenderer.getCitation(currentCitationId, currentFormat);
        citationText.textContent = citation;
    }
    
    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(citationText.textContent);
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = citationText.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        }
    });
}

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