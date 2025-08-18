// Global variables
let currentSlideIndex = 0;
let currentGallery = '';
let currentImageIndex = 0;
let galleryImages = [];

// Portfolio image collections
const portfolioImages = {
    portraits: [
        'images/portraits/portrait1.jpg',
        'images/portraits/portrait2.jpg',
        'images/portraits/portrait3.jpg',
        'images/portraits/portrait4.jpg',
        'images/portraits/portrait5.jpg',
        'images/portraits/portrait6.jpg'
    ],
    events: [
        'images/events/event1.jpg',
        'images/events/event2.jpg',
        'images/events/event3.jpg',
        'images/events/event4.jpg',
        'images/events/event5.jpg',
        'images/events/event6.jpg'
    ],
    products: [
        'images/products/product1.jpg',
        'images/products/product2.jpg',
        'images/products/product3.jpg',
        'images/products/product4.jpg',
        'images/products/product5.jpg',
        'images/products/product6.jpg'
    ],
    corporate: [
        'images/corporate/corporate1.jpg',
        'images/corporate/corporate2.jpg',
        'images/corporate/corporate3.jpg',
        'images/corporate/corporate4.jpg',
        'images/corporate/corporate5.jpg',
        'images/corporate/corporate6.jpg'
    ],
    misc: [
        'images/misc/misc1.jpg',
        'images/misc/misc2.jpg',
        'images/misc/misc3.jpg',
        'images/misc/misc4.jpg',
        'images/misc/misc5.jpg',
        'images/misc/misc6.jpg'
    ]
};

// Image effects and watermarking functions
function applyImageEffects(canvas, ctx, img) {
    // Draw the original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply exposure adjustment (-15) and sepia effect
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Exposure adjustment (darken by reducing values)
        const exposureFactor = 0.85; // -15 exposure equivalent
        r *= exposureFactor;
        g *= exposureFactor;
        b *= exposureFactor;
        
        // Sepia effect
        const sepiaIntensity = 0.3; // Subtle sepia
        const sepiaR = (r * 0.393) + (g * 0.769) + (b * 0.189);
        const sepiaG = (r * 0.349) + (g * 0.686) + (b * 0.168);
        const sepiaB = (r * 0.272) + (g * 0.534) + (b * 0.131);
        
        // Blend sepia with original
        data[i] = Math.min(255, r * (1 - sepiaIntensity) + sepiaR * sepiaIntensity);
        data[i + 1] = Math.min(255, g * (1 - sepiaIntensity) + sepiaG * sepiaIntensity);
        data[i + 2] = Math.min(255, b * (1 - sepiaIntensity) + sepiaB * sepiaIntensity);
    }
    
    // Apply the processed image data
    ctx.putImageData(imageData, 0, 0);
    
    // Add watermark
    addWatermark(canvas, ctx);
}

function addWatermark(canvas, ctx) {
    // Save current context state
    ctx.save();
    
    // Set watermark properties with higher opacity
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#3c2414';
    ctx.font = 'bold 16px Playfair Display';
    ctx.textAlign = 'center';
    
    // Position watermark in bottom right
    const x = canvas.width - 120;
    const y = canvas.height - 40;
    
    // Draw watermark text with shadow for better visibility
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText('MAYA MIND', x, y);
    ctx.font = 'bold 12px Playfair Display';
    ctx.fillText('PHOTOGRAPHY', x, y + 20);
    
    // Restore context state
    ctx.restore();
}

function loadImageWithEffects(canvas, imageSrc, fallbackText = 'Loading...') {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        applyImageEffects(canvas, ctx, img);
    };
    
    img.onerror = function() {
        // Draw fallback placeholder
        ctx.fillStyle = '#f5f3f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#8b6914';
        ctx.font = '16px Playfair Display';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fallbackText, canvas.width / 2, canvas.height / 2);
        
        // Add watermark even to placeholder
        addWatermark(canvas, ctx);
    };
    
    img.src = imageSrc;
}

// Carousel functionality
function initializeCarousel() {
    const carousel = document.getElementById('carousel');
    const indicators = document.getElementById('indicators');
    
    // Create carousel slides (15 images)
    for (let i = 1; i <= 15; i++) {
        const slide = document.createElement('div');
        slide.className = 'carousel-item';
        if (i === 1) slide.classList.add('active');
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        slide.appendChild(canvas);
        carousel.appendChild(slide);
        
        // Load image with effects
        loadImageWithEffects(canvas, `images/carousel/image${i}.jpg`, `Image ${i}`);
        
        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (i === 1) indicator.classList.add('active');
        indicator.onclick = () => currentSlide(i);
        indicators.appendChild(indicator);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-item');
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Initialize portfolio preview canvases
function initializePortfolioPreviews() {
    const previewCanvases = document.querySelectorAll('.preview-canvas');
    
    previewCanvases.forEach(canvas => {
        const imageSrc = canvas.getAttribute('data-src');
        loadImageWithEffects(canvas, imageSrc, 'Click to View');
    });
    
    // Initialize about image canvas
    const aboutCanvas = document.querySelector('.about-canvas');
    if (aboutCanvas) {
        const imageSrc = aboutCanvas.getAttribute('data-src');
        loadImageWithEffects(aboutCanvas, imageSrc, 'About Image');
    }
}

// Gallery modal functionality
function openGallery(category, imageIndex) {
    currentGallery = category;
    currentImageIndex = imageIndex;
    galleryImages = portfolioImages[category];
    
    const modal = document.getElementById('galleryModal');
    const title = document.getElementById('galleryTitle');
    
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    updateModalImage();
    createThumbnails();
    
    modal.style.display = 'block';
    animateButterfly();
}

function updateModalImage() {
    const modalCanvas = document.getElementById('modalCanvas');
    const counter = document.getElementById('imageCounter');
    const ctx = modalCanvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Calculate available space (leaving room for modal padding and controls)
        const availableWidth = screenWidth * 0.9; // 90% of screen width
        const availableHeight = screenHeight * 0.8; // 80% of screen height (leave room for controls)
        
        // Get original image dimensions
        const imageWidth = img.naturalWidth || img.width;
        const imageHeight = img.naturalHeight || img.height;
        
        // Calculate the original aspect ratio
        const aspectRatio = imageWidth / imageHeight;
        
        // Determine final dimensions while preserving aspect ratio
        let finalWidth, finalHeight;
        
        // Try fitting by width first
        if (imageWidth <= availableWidth && imageHeight <= availableHeight) {
            // Image fits naturally, use original size
            finalWidth = imageWidth;
            finalHeight = imageHeight;
        } else {
            // Image needs scaling - determine limiting factor
            const widthScale = availableWidth / imageWidth;
            const heightScale = availableHeight / imageHeight;
            
            // Use the smaller scale to ensure both dimensions fit
            const scale = Math.min(widthScale, heightScale);
            
            finalWidth = Math.floor(imageWidth * scale);
            finalHeight = Math.floor(imageHeight * scale);
        }
        
        // Verify aspect ratio is maintained (with small tolerance for rounding)
        const finalAspectRatio = finalWidth / finalHeight;
        const aspectRatioDiff = Math.abs(aspectRatio - finalAspectRatio);
        
        if (aspectRatioDiff > 0.01) {
            // Recalculate to ensure perfect aspect ratio
            if (aspectRatio > 1) {
                // Landscape - adjust height
                finalHeight = Math.floor(finalWidth / aspectRatio);
            } else {
                // Portrait - adjust width
                finalWidth = Math.floor(finalHeight * aspectRatio);
            }
        }
        
        // Set canvas to exact calculated dimensions
        modalCanvas.width = finalWidth;
        modalCanvas.height = finalHeight;
        modalCanvas.style.width = finalWidth + 'px';
        modalCanvas.style.height = finalHeight + 'px';
        
        // Clear and draw image with exact fit
        ctx.clearRect(0, 0, finalWidth, finalHeight);
        
        // Draw image to fill canvas exactly (should be perfect fit now)
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        
        // Apply image effects
        const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
        const data = imageData.data;
        
        // Apply exposure adjustment (-15) and sepia effect
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Exposure adjustment (darken by reducing values)
            const exposureFactor = 0.85; // -15 exposure equivalent
            r *= exposureFactor;
            g *= exposureFactor;
            b *= exposureFactor;
            
            // Sepia effect
            const sepiaIntensity = 0.3; // Subtle sepia
            const sepiaR = (r * 0.393) + (g * 0.769) + (b * 0.189);
            const sepiaG = (r * 0.349) + (g * 0.686) + (b * 0.168);
            const sepiaB = (r * 0.272) + (g * 0.534) + (b * 0.131);
            
            // Blend sepia with original
            data[i] = Math.min(255, r * (1 - sepiaIntensity) + sepiaR * sepiaIntensity);
            data[i + 1] = Math.min(255, g * (1 - sepiaIntensity) + sepiaG * sepiaIntensity);
            data[i + 2] = Math.min(255, b * (1 - sepiaIntensity) + sepiaB * sepiaIntensity);
        }
        
        // Apply the processed image data
        ctx.putImageData(imageData, 0, 0);
        
        // Add watermark
        addWatermark(modalCanvas, ctx);
    };
    
    img.onerror = function() {
        // Fallback for missing images with proper aspect ratio
        const fallbackWidth = Math.min(600, window.innerWidth * 0.8);
        const fallbackHeight = Math.min(400, window.innerHeight * 0.6);
        
        modalCanvas.width = fallbackWidth;
        modalCanvas.height = fallbackHeight;
        modalCanvas.style.width = fallbackWidth + 'px';
        modalCanvas.style.height = fallbackHeight + 'px';
        
        ctx.fillStyle = '#f5f3f0';
        ctx.fillRect(0, 0, fallbackWidth, fallbackHeight);
        ctx.fillStyle = '#8b6914';
        ctx.font = '24px Playfair Display';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${currentGallery} ${currentImageIndex + 1}`, fallbackWidth / 2, fallbackHeight / 2);
        addWatermark(modalCanvas, ctx);
    };
    
    img.src = galleryImages[currentImageIndex];
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    updateThumbnailsActive();
}

function createThumbnails() {
    const thumbnails = document.getElementById('modalThumbnails');
    thumbnails.innerHTML = '';
    
    galleryImages.forEach((imageSrc, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 60;
        canvas.onclick = () => {
            currentImageIndex = index;
            updateModalImage();
        };
        
        loadImageWithEffects(canvas, imageSrc, `${index + 1}`);
        thumbnails.appendChild(canvas);
    });
}

function updateThumbnailsActive() {
    const thumbnails = document.querySelectorAll('#modalThumbnails canvas');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
}

// Smooth scrolling navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                animateButterfly();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Butterfly animation
function animateButterfly() {
    const butterfly = document.getElementById('butterfly');
    butterfly.style.animation = 'flutter 0.5s ease-in-out';
    
    setTimeout(() => {
        butterfly.style.animation = 'flutter 2s ease-in-out infinite';
    }, 500);
}

// Update butterfly position on scroll
function initializeButterflyScroll() {
    window.addEventListener('scroll', function() {
        const butterfly = document.getElementById('butterfly');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.1;
        
        butterfly.style.transform = `translateY(${rate}px)`;
    });
}

// Contact form handling
function initializeContactForm() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        });
    }
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('galleryModal');
        const isModalOpen = modal.style.display === 'block';
        
        if (isModalOpen) {
            switch(e.key) {
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'Escape':
                    closeGallery();
                    break;
            }
        } else {
            switch(e.key) {
                case 'ArrowLeft':
                    changeSlide(-1);
                    break;
                case 'ArrowRight':
                    changeSlide(1);
                    break;
            }
        }
    });
}

// Touch/swipe support
function initializeTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const modal = document.getElementById('galleryModal');
        const isModalOpen = modal.style.display === 'block';
        
        if (isModalOpen) {
            if (touchEndX < touchStartX - 50) {
                nextImage();
            }
            if (touchEndX > touchStartX + 50) {
                prevImage();
            }
        } else {
            if (touchEndX < touchStartX - 50) {
                changeSlide(1);
            }
            if (touchEndX > touchStartX + 50) {
                changeSlide(-1);
            }
        }
    }
}

// Modal close on outside click
function initializeModalClose() {
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('galleryModal');
        if (event.target === modal) {
            closeGallery();
        }
    });
}

// Auto-advance carousel
function initializeAutoCarousel() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializePortfolioPreviews();
    initializeNavigation();
    initializeButterflyScroll();
    initializeContactForm();
    initializeKeyboardNavigation();
    initializeTouchSupport();
    initializeModalClose();
    initializeAutoCarousel();
    
    // Show first slide
    showSlide(0);
    
    console.log('Portfolio with image effects and watermarking initialized successfully!');
});