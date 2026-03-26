/**
 * Grand Horizon Hotel - Interaction & Analytics Tracking
 */

// --- Google Analytics Placeholder ---
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Initialize Data Layer
window.dataLayer = window.dataLayer || [];
function gtag() {
    window.dataLayer.push(arguments);
}

// Load GA Script
if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
} else {
    console.log('GA4: Measurement ID not set. Tracking events to console instead.');
}

/**
 * Event Tracking Helper
 */
function trackEvent(eventName, params = {}) {
    if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        gtag('event', eventName, params);
    }
    console.log(`[Analytics Event] ${eventName}:`, params);
}

/**
 * Interaction Handling
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Track Page View (Implicitly handled by gtag config, but logging here)
    trackEvent('page_view', { page_title: document.title });

    // 2. Button Click Events
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.innerText;
            const section = e.target.closest('section')?.id || 'hero';
            
            trackEvent('button_click', {
                button_name: buttonText,
                section: section
            });

            if (buttonText === 'BOOK NOW') {
                alert(`Redirecting to booking for: ${e.target.closest('.room-card').querySelector('h3').innerText}`);
            }
        });
    });

    // 3. Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            trackEvent('form_submission', {
                form_id: 'contact_form',
                user_email: data.email // In real GA, be careful with PII
            });

            console.log('Form Data Submitted:', data);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // 4. Scroll Depth Tracking
    let scroll25 = false;
    let scroll50 = false;
    let scroll75 = false;
    let scroll100 = false;

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;

        if (scrollPercent >= 25 && !scroll25) {
            trackEvent('scroll_depth', { percentage: 25 });
            scroll25 = true;
        }
        if (scrollPercent >= 50 && !scroll50) {
            trackEvent('scroll_depth', { percentage: 50 });
            scroll50 = true;
        }
        if (scrollPercent >= 75 && !scroll75) {
            trackEvent('scroll_depth', { percentage: 75 });
            scroll75 = true;
        }
        if (scrollPercent >= 99 && !scroll100) {
            trackEvent('scroll_depth', { percentage: 100 });
            scroll100 = true;
        }
    });

    // 5. Section View Tracking (Intersection Observer)
    const observerOptions = {
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', { section_id: entry.target.id });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
});
