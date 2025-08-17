document.addEventListener('DOMContentLoaded', function() {
    // Video hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const video = item.querySelector('video');
        
        if (video) {
            // Play video on hover and scale up
            item.addEventListener('mouseenter', function() {
                video.play();
                video.style.transform = 'scale(1.1)';
            });
            
            // Pause video when mouse leaves and reset scale
            item.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
                video.style.transform = 'scale(1)';
            });
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // CTA button smooth scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.querySelector('#gaming').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('form-response');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Simulate form submission (local mode)
            setTimeout(() => {
                // Display success message
                formResponse.className = 'form-response success';
                formResponse.style.display = 'block';
                formResponse.innerHTML = `
                    <h3>Thank you, ${formData.name}!</h3>
                    <p>Your message has been received. We'll get back to you soon regarding your ${formData.service} project.</p>
                `;
                
                // Log form data to console (for development)
                console.log('Form submission:', formData);
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 5000);
                
            }, 1000); // Simulate network delay
        });
    }
    
    // Scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all portfolio sections
    const sections = document.querySelectorAll('.portfolio-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Apple-style navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.72)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
        }
    });
    
    // Portfolio item click handler for fullscreen view (optional)
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.overlay h3').textContent;
            const description = this.querySelector('.overlay p').textContent;
            
            // You can add modal functionality here if needed
            console.log('Clicked portfolio item:', title, description);
        });
    });
});

// YouTube video functionality
function playYouTubeVideo(element) {
    const videoId = element.getAttribute('data-video-id');
    const iframe = document.createElement('iframe');
    
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    // Replace the thumbnail with the iframe
    element.innerHTML = '';
    element.appendChild(iframe);
    element.style.cursor = 'default';
}
