document.addEventListener('DOMContentLoaded', function() {
    // Video streaming control - load only when play button is clicked
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Set preload based on file size estimation
        const fileSize = estimateFileSize(video.currentSrc || video.querySelector('source')?.src);
        video.preload = fileSize > 50 ? 'metadata' : 'none';
        
        // Generate thumbnail if not already set
        if (!video.poster) {
            // Add loading placeholder first
            video.style.backgroundColor = '#1a0b2e';
            generateThumbnail(video);
        }
        
        // Add event listener for when user clicks play
        video.addEventListener('loadstart', function() {
            console.log('Video started loading:', this.currentSrc);
        });
        
        // Optional: Add loading indicator
        video.addEventListener('waiting', function() {
            console.log('Video is buffering...');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
        });
        
        // Pause other videos when this one starts playing
        video.addEventListener('play', function() {
            pauseOtherVideos(this);
        });
    });
    
    // Function to estimate file size from filename (rough estimation)
    function estimateFileSize(src) {
        if (!src) return 0;
        const filename = src.toLowerCase();
        // Gaming and motion graphics videos tend to be larger
        if (filename.includes('gaming') || filename.includes('motion')) return 100;
        if (filename.includes('documentary')) return 65;
        return 10; // Default for smaller videos
    }
    
    // Function to pause all other videos when one starts playing
    function pauseOtherVideos(currentVideo) {
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            if (video !== currentVideo && !video.paused) {
                video.pause();
                console.log('Paused other video:', video.currentSrc);
            }
        });
    }
    
    // Pause all videos when page becomes hidden (user switches tabs/minimizes browser)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                    console.log('Paused video due to tab switch:', video.currentSrc);
                }
            });
        }
    });
    
    // Function to generate thumbnail from video
    function generateThumbnail(video) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create a temporary video element to load and capture frame
        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.setAttribute('playsinline', '');
        tempVideo.setAttribute('webkit-playsinline', '');
        
        // Get the video source
        const source = video.querySelector('source');
        if (source) {
            tempVideo.src = source.src;
        }
        
        // Set up event listeners
        tempVideo.addEventListener('loadedmetadata', function() {
            // Set canvas dimensions to match video
            canvas.width = this.videoWidth || 640;
            canvas.height = this.videoHeight || 360;
            
            // Seek to 2 seconds (or 10% of video duration, whichever is smaller)
            const seekTime = Math.min(2, this.duration * 0.1);
            this.currentTime = seekTime;
        });
        
        tempVideo.addEventListener('seeked', function() {
            try {
                // Draw the current frame to canvas
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                
                // Add a subtle overlay to indicate it's clickable
                const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)/2);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add a small play icon in the center
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const playSize = Math.min(canvas.width, canvas.height) * 0.1;
                
                // Play button background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, playSize, 0, 2 * Math.PI);
                ctx.fill();
                
                // Play triangle
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.moveTo(centerX - playSize * 0.3, centerY - playSize * 0.4);
                ctx.lineTo(centerX - playSize * 0.3, centerY + playSize * 0.4);
                ctx.lineTo(centerX + playSize * 0.5, centerY);
                ctx.closePath();
                ctx.fill();
                
                // Convert canvas to data URL and set as poster
                const thumbnailDataURL = canvas.toDataURL('image/jpeg', 0.85);
                video.poster = thumbnailDataURL;
                
                console.log('Generated thumbnail for video:', source.src);
            } catch (error) {
                console.log('Error generating thumbnail:', error);
                // Fallback to placeholder thumbnail
                createPlaceholderThumbnail(video);
            }
            
            // Clean up
            this.remove();
        });
        
        tempVideo.addEventListener('error', function(e) {
            console.log('Error loading video for thumbnail:', e);
            // Fallback to placeholder thumbnail
            createPlaceholderThumbnail(video);
            this.remove();
        });
        
        // Start loading the video
        tempVideo.load();
    }
    
    // Function to create a placeholder thumbnail
    function createPlaceholderThumbnail(video) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;
        
        // Determine section type based on the video's parent section
        const section = video.closest('.portfolio-section');
        const sectionId = section ? section.id : 'default';
        
        // Create gradient background based on section
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        switch(sectionId) {
            case 'brand':
                gradient.addColorStop(0, '#e11d48');
                gradient.addColorStop(0.5, '#dc2626');
                gradient.addColorStop(1, '#b91c1c');
                break;
            case 'animation':
                gradient.addColorStop(0, '#059669');
                gradient.addColorStop(0.5, '#047857');
                gradient.addColorStop(1, '#065f46');
                break;
            case 'motion':
                gradient.addColorStop(0, '#7c3aed');
                gradient.addColorStop(0.5, '#6d28d9');
                gradient.addColorStop(1, '#5b21b6');
                break;
            case 'gaming':
                gradient.addColorStop(0, '#ea580c');
                gradient.addColorStop(0.5, '#dc2626');
                gradient.addColorStop(1, '#b91c1c');
                break;
            case 'documentary':
                gradient.addColorStop(0, '#0891b2');
                gradient.addColorStop(0.5, '#0e7490');
                gradient.addColorStop(1, '#155e75');
                break;
            case 'shortform':
                gradient.addColorStop(0, '#db2777');
                gradient.addColorStop(0.5, '#be185d');
                gradient.addColorStop(1, '#9d174d');
                break;
            default:
                gradient.addColorStop(0, '#a855f7');
                gradient.addColorStop(0.5, '#8b5cf6');
                gradient.addColorStop(1, '#7c3aed');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add play button icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add triangle (play icon)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - 18, canvas.height/2 - 25);
        ctx.lineTo(canvas.width/2 - 18, canvas.height/2 + 25);
        ctx.lineTo(canvas.width/2 + 25, canvas.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Add section title
        const sectionTitle = section ? section.querySelector('h2').textContent : 'Video';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sectionTitle, canvas.width/2, 60);
        
        // Add subtitle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Click to Watch', canvas.width/2, canvas.height/2 + 100);
        
        video.poster = canvas.toDataURL('image/jpeg', 0.9);
    }
    
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

