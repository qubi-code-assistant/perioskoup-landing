document.addEventListener('DOMContentLoaded', () => {
    const heroPhone = document.querySelector('.hero-phone');
    const interactionCards = document.querySelectorAll('.interaction-card');
    const screenContent = document.querySelector('.phone-screen-content');

    if (!heroPhone || !screenContent) return;

    // Save original screen HTML and hide all children initially for intro animation
    const originalHTML = screenContent.innerHTML;
    screenContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // Build intro screen (elements hidden, will animate in)
    screenContent.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;height:100%;padding:55px 22px 16px;background:linear-gradient(180deg, #0d1b24 0%, #11222d 100%);">
            <div style="flex:1;"></div>
            <div id="intro-logo" style="width:88px;height:88px;border-radius:50%;background:radial-gradient(circle, #2f5f84 0%, #1d3449 70%, #12222d 100%);display:flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 0 30px rgba(47,95,132,0.4), 0 0 60px rgba(47,95,132,0.15);opacity:0;transform:scale(0.5);transition:opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.6s ease;">
                <img src="/app-logomark.webp" alt="" style="width:56px;height:56px;" aria-hidden="true">
            </div>
            <p id="intro-title" style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.3px;font-family:'Dongle',-apple-system,sans-serif;margin-bottom:2px;opacity:0;transform:translateY(10px);transition:opacity 0.5s ease, transform 0.5s ease;">Perioskoup</p>
            <p id="intro-subtitle" style="color:#7a9aab;font-size:11px;font-family:-apple-system,sans-serif;margin-bottom:24px;opacity:0;transform:translateY(10px);transition:opacity 0.5s ease, transform 0.5s ease;">Your Personal Dental Companion</p>
            <p id="intro-role" style="color:#7a9aab;font-size:12px;font-family:-apple-system,sans-serif;margin-bottom:14px;opacity:0;transition:opacity 0.4s ease;">Select your role</p>
            <div id="intro-buttons" style="width:100%;display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">
                <div style="background:#c0e57a;border-radius:14px;padding:15px;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transform:translateY(20px);transition:opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);" class="intro-btn">
                    <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="#0d1b24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <span style="color:#0d1b24;font-size:14px;font-weight:700;font-family:-apple-system,sans-serif;">Patient</span>
                </div>
                <div style="background:#c0e57a;border-radius:14px;padding:15px;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transform:translateY(20px);transition:opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);" class="intro-btn">
                    <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="#0d1b24"><path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z"/></svg>
                    <span style="color:#0d1b24;font-size:14px;font-weight:700;font-family:-apple-system,sans-serif;">Dentist</span>
                </div>
            </div>
            <div style="flex:1.5;"></div>
            <div style="width:100px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;"></div>
        </div>
    `;

    // Phone entrance
    setTimeout(() => {
        heroPhone.classList.add('phone-entrance');
    }, 300);

    // Intro animation sequence
    const t0 = 800; // after phone slides in

    // 1. Logo pops in with bounce
    setTimeout(() => {
        const logo = document.getElementById('intro-logo');
        if (logo) { logo.style.opacity = '1'; logo.style.transform = 'scale(1)'; logo.style.boxShadow = '0 0 40px rgba(47,95,132,0.6), 0 0 80px rgba(47,95,132,0.2)'; }
    }, t0);

    // 2. Title fades in
    setTimeout(() => {
        const el = document.getElementById('intro-title');
        if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
    }, t0 + 400);

    // 3. Subtitle
    setTimeout(() => {
        const el = document.getElementById('intro-subtitle');
        if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
    }, t0 + 650);

    // 4. "Select your role"
    setTimeout(() => {
        const el = document.getElementById('intro-role');
        if (el) { el.style.opacity = '1'; }
    }, t0 + 900);

    // 5. Buttons slide up one by one
    setTimeout(() => {
        const btns = document.querySelectorAll('.intro-btn');
        btns.forEach((btn, i) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, i * 200);
        });
    }, t0 + 1100);

    // 6. Notification cards appear
    setTimeout(() => {
        interactionCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('show'), i * 300);
        });
    }, t0 + 1800);

    // Screen cycling data
    const screens = [
        null, // screen 0 = role selection (original)
        `<div style="display:flex;flex-direction:column;align-items:center;width:100%;height:100%;padding:55px 22px 16px;background:linear-gradient(180deg, #0d1b24 0%, #11222d 100%);">
            <div style="flex:0.3;"></div>
            <p style="color:#c0e57a;font-size:18px;font-weight:700;font-family:-apple-system,sans-serif;margin-bottom:16px;">Patient Dashboard</p>
            <div style="width:100%;background:rgba(192,229,122,0.1);border:1px solid rgba(192,229,122,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">
                <p style="color:#c0e57a;font-size:11px;font-weight:600;margin-bottom:4px;">Brushing Streak</p>
                <div style="display:flex;align-items:center;gap:6px;">
                    <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                        <div style="width:85%;height:100%;background:#c0e57a;border-radius:3px;"></div>
                    </div>
                    <span style="color:white;font-size:11px;font-weight:600;">85%</span>
                </div>
            </div>
            <div style="width:100%;background:rgba(53,120,170,0.15);border:1px solid rgba(53,120,170,0.25);border-radius:12px;padding:12px;margin-bottom:10px;">
                <p style="color:#3578aa;font-size:11px;font-weight:600;margin-bottom:4px;">Next Appointment</p>
                <p style="color:white;font-size:13px;">Feb 28 — Dr. Smith</p>
            </div>
            <div style="width:100%;background:rgba(192,229,122,0.1);border:1px solid rgba(192,229,122,0.2);border-radius:12px;padding:12px;">
                <p style="color:#c0e57a;font-size:11px;font-weight:600;margin-bottom:4px;">AI Tip</p>
                <p style="color:rgba(255,255,255,0.7);font-size:11px;">Focus on lower-left molars today — your bleeding score improved there!</p>
            </div>
            <div style="flex:1;"></div>
            <div style="width:100px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;"></div>
        </div>`,
        `<div style="display:flex;flex-direction:column;align-items:center;width:100%;height:100%;padding:55px 22px 16px;background:linear-gradient(180deg, #0d1b24 0%, #11222d 100%);">
            <div style="flex:0.2;"></div>
            <p style="color:#c0e57a;font-size:18px;font-weight:700;font-family:-apple-system,sans-serif;margin-bottom:16px;">AI Assistant</p>
            <div style="width:100%;display:flex;flex-direction:column;gap:8px;">
                <div style="align-self:flex-end;background:rgba(192,229,122,0.15);border:1px solid rgba(192,229,122,0.2);border-radius:12px 12px 4px 12px;padding:10px 12px;max-width:80%;">
                    <p style="color:white;font-size:11px;">My gums are bleeding when I floss</p>
                </div>
                <div style="align-self:flex-start;background:rgba(53,120,170,0.2);border:1px solid rgba(53,120,170,0.25);border-radius:12px 12px 12px 4px;padding:10px 12px;max-width:85%;">
                    <p style="color:white;font-size:11px;">That's common initially! Try angling your floss in a C-shape. I'll add a gentle flossing reminder for you. 🦷</p>
                </div>
                <div style="align-self:flex-end;background:rgba(192,229,122,0.15);border:1px solid rgba(192,229,122,0.2);border-radius:12px 12px 4px 12px;padding:10px 12px;max-width:80%;">
                    <p style="color:white;font-size:11px;">Thanks! How often should I floss?</p>
                </div>
                <div style="align-self:flex-start;background:rgba(53,120,170,0.2);border:1px solid rgba(53,120,170,0.25);border-radius:12px 12px 12px 4px;padding:10px 12px;max-width:85%;">
                    <p style="color:white;font-size:11px;">Once daily is ideal. Dr. Smith noted your interdental spaces are tight — try floss tape instead.</p>
                </div>
            </div>
            <div style="flex:1;"></div>
            <div style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:10px 14px;display:flex;align-items:center;gap:8px;">
                <span style="color:rgba(255,255,255,0.3);font-size:12px;">Ask anything...</span>
            </div>
            <div style="height:8px;"></div>
            <div style="width:100px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;"></div>
        </div>`
    ];

    let currentScreen = 0;

    function cycleScreen() {
        currentScreen = (currentScreen + 1) % screens.length;

        // Fade out
        screenContent.style.opacity = '0';
        screenContent.style.transform = 'scale(0.95)';

        setTimeout(() => {
            if (screens[currentScreen]) {
                screenContent.innerHTML = screens[currentScreen];
            } else {
                screenContent.innerHTML = originalHTML;
            }
            screenContent.style.opacity = '1';
            screenContent.style.transform = 'scale(1)';
        }, 400);
    }

    // Start cycling after intro completes (~2.5s intro + 1s pause)
    setTimeout(() => {
        // Store role selection screen as original for cycling back
        screenContent.dataset.original = screenContent.innerHTML;
        setInterval(cycleScreen, 3500);
    }, t0 + 2700);

    // Mouse Parallax
    function handleMouseMove(e) {
        if (window.innerWidth < 1024) return;
        const phone = document.querySelector('.hero-phone');
        if (!phone) return;
        const rect = phone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / window.innerWidth;
        const deltaY = (e.clientY - centerY) / window.innerHeight;
        phone.style.transform = `perspective(1200px) rotateY(${-12 + deltaX * 5}deg) rotateX(${2 + deltaY * -3}deg)`;
    }

    window.addEventListener('mousemove', handleMouseMove);
});
