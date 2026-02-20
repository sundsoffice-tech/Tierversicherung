/* ==========================================
   BELLO VERSICHERUNG – Landing Page Script
   Lead Gen + DSGVO + Animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Cookie Banner ===
    const cookieBanner = document.getElementById('cookieBanner');
    if (localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('hidden');
    }

    window.acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.add('hidden');
        // Hier Meta Pixel / Google Analytics aktivieren
        // if (typeof fbq !== 'undefined') fbq('track', 'PageView');
    };

    window.declineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.add('hidden');
    };

    // === Pet Type Toggle ===
    const petBtns = document.querySelectorAll('.pet-btn');
    const petTypeInput = document.getElementById('petType');

    petBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            petBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            petTypeInput.value = btn.dataset.type;
        });
    });

    // === Form Submission ===
    const heroForm = document.getElementById('heroForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('heroSubmitBtn');

    heroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const petName = document.getElementById('petName');
        const phone = document.getElementById('phone');
        const consent = document.getElementById('consent');

        // Reset errors
        petName.classList.remove('error');
        phone.classList.remove('error');

        // Validate
        let valid = true;

        if (!petName.value.trim()) {
            petName.classList.add('error');
            petName.focus();
            valid = false;
        }

        if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 6) {
            phone.classList.add('error');
            if (valid) phone.focus();
            valid = false;
        }

        if (!consent.checked) {
            consent.parentElement.style.animation = 'shake 0.5s';
            setTimeout(() => consent.parentElement.style.animation = '', 500);
            valid = false;
        }

        if (!valid) return;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.querySelector('.cta-text').textContent = 'Wird gesendet...';

        const formData = {
            petName: petName.value.trim(),
            petType: petTypeInput.value,
            phone: phone.value.trim(),
            consent: true,
            timestamp: new Date().toISOString(),
            source: 'bello-landing-page',
            page_url: window.location.href
        };

        // === WEBHOOK INTEGRATION ===
        // Wähle eine der folgenden Optionen:

        // Option 1: Make.com (Integromat) Webhook
        /*
        try {
            await fetch('https://hook.eu1.make.com/DEIN_WEBHOOK_PFAD', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (err) { console.log('Webhook error:', err); }
        */

        // Option 2: Google Sheets via Apps Script
        /*
        try {
            await fetch('https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
        } catch (err) { console.log('Sheets error:', err); }
        */

        // Option 3: Formspree
        /*
        try {
            await fetch('https://formspree.io/f/DEINE_FORM_ID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (err) { console.log('Formspree error:', err); }
        */

        // Backup: localStorage
        const leads = JSON.parse(localStorage.getItem('belloLeads') || '[]');
        leads.push(formData);
        localStorage.setItem('belloLeads', JSON.stringify(leads));

        // Conversion Tracking
        // if (typeof fbq !== 'undefined') fbq('track', 'Lead');
        // if (typeof gtag !== 'undefined') gtag('event', 'conversion', { send_to: 'AW-XXXXX/XXXXX' });

        // Show success
        heroForm.style.display = 'none';
        document.querySelector('.form-card-header').style.display = 'none';
        formSuccess.style.display = 'block';
        document.getElementById('successPetName').textContent = petName.value.trim();

        console.log('Lead captured:', formData);
    });

    // Shake animation for consent
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(style);

    // === FAQ Accordion ===
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // === Scroll Animations (IntersectionObserver) ===
    const animateElements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay based on sibling index
                const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${siblingIndex * 0.12}s`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));

    // === Cost Bar Animation ===
    const costBars = document.querySelectorAll('.cost-bar-fill');
    const costObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = width + '%';
                costObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    costBars.forEach(bar => costObserver.observe(bar));

    // === Floating CTA (Mobile) ===
    const floatingCta = document.getElementById('floatingCta');
    const heroFormEl = document.querySelector('.hero-form-wrapper');

    if (floatingCta && heroFormEl) {
        const floatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingCta.classList.remove('visible');
                } else {
                    floatingCta.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        floatObserver.observe(heroFormEl);
    }

    // === Live Consultation Counter ===
    const consultCount = document.getElementById('consultCount');
    if (consultCount) {
        let count = Math.floor(Math.random() * 80) + 280;
        consultCount.textContent = count;

        setInterval(() => {
            if (Math.random() > 0.6) {
                count += Math.floor(Math.random() * 3) + 1;
                consultCount.textContent = count;
            }
        }, 8000);
    }

    // === Social Proof Popup ===
    const proofData = [
        { name: 'Lisa aus München', action: 'hat gerade eine Beratung angefragt', emoji: '🐕' },
        { name: 'Markus aus Berlin', action: 'hat Vollschutz für Lucky abgeschlossen', emoji: '🐾' },
        { name: 'Anna aus Hamburg', action: 'hat eine Beratung für ihre Katze angefragt', emoji: '🐈' },
        { name: 'Stefan aus Köln', action: 'hat OP-Schutz für seinen Labrador gewählt', emoji: '🦮' },
        { name: 'Julia aus Frankfurt', action: 'hat gerade eine Beratung angefragt', emoji: '🐕' },
        { name: 'Kevin aus Düsseldorf', action: 'hat Vollschutz für Buddy abgeschlossen', emoji: '🐶' },
        { name: 'Sarah aus Stuttgart', action: 'hat eine Beratung für ihre Katze angefragt', emoji: '🐱' },
        { name: 'Thomas aus Dortmund', action: 'hat OP-Schutz für Bello gewählt', emoji: '🐕‍🦺' },
    ];

    const proofPopup = document.getElementById('socialProof');
    const proofName = document.getElementById('proofName');
    const proofAction = document.getElementById('proofAction');
    const proofAvatar = document.querySelector('.proof-avatar');
    let proofIndex = 0;

    function showSocialProof() {
        const data = proofData[proofIndex % proofData.length];
        proofName.textContent = data.name;
        proofAction.textContent = data.action;
        proofAvatar.textContent = data.emoji;

        proofPopup.classList.add('visible');

        setTimeout(() => {
            proofPopup.classList.remove('visible');
        }, 4000);

        proofIndex++;
    }

    // First popup after 12s, then every 25-40s
    setTimeout(() => {
        showSocialProof();
        setInterval(() => {
            const delay = Math.random() * 15000 + 25000;
            setTimeout(showSocialProof, delay);
        }, 40000);
    }, 12000);

    // === Phone Input Formatting ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Only allow digits, spaces, +, -, /
            e.target.value = e.target.value.replace(/[^\d\s+\-\/()]/g, '');
        });
    }

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
