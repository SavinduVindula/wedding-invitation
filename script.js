// Initialization
AOS.init({ once: true, duration: 800 });

// --- TIKTOK TREND: FLOATING DUST PARTICLES ---
if (typeof tsParticles !== 'undefined') {
    tsParticles.load("tsparticles-canvas", {
        fpsLimit: 60,
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: false } },
            move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: { events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: false } } },
        retina_detect: true
    });
}

// --- URL PARAMETER & PERSONALIZED INVITATION ---
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('guest');

if (guestName) {
    // Escape HTML to prevent basic XSS
    const safeName = guestName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Update Opening Text
    document.getElementById("invite-text").innerHTML = `Dear ${safeName},<br>You are invited...`;

    // Pre-fill RSVP Input
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.value = safeName;
    }
}

// --- GLOBAL SCROLL PROGRESS INDICATOR ---
window.addEventListener("scroll", () => {
    const scrollPos = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollPos / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});


// --- 1. OPENING SCREEN (ENVELOPE WAX SEAL) & SMART MUSIC LOGIC ---
const envelopeWrapper = document.querySelector(".envelope-wrapper");
const openingScreen = document.getElementById("opening-screen");
const body = document.body;
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const envFlap = document.getElementById("env-flap");
const waxSeal = document.getElementById("wax-seal");
const envCard = document.getElementById("envelope-card");

envelopeWrapper.addEventListener("click", () => {

    // Animation Part 1: Break Wax Seal, Pull Card Up, & Flap Opens 3D
    if (waxSeal) waxSeal.classList.add("hide-seal");
    envFlap.classList.add("opened");
    if (envCard) envCard.classList.add("pull-out");

    // Animation Part 2 (Delayed): Envelope Fades Away (Let card read for 2 seconds)
    setTimeout(() => {
        openingScreen.classList.add("fade-out"); // CSS Animation fade
        body.classList.remove("no-scroll"); // Allow scrolling
        musicBtn.style.display = "block"; // Show floating music button
        AOS.refresh();
    }, 4500);

    setTimeout(() => {
        openingScreen.style.display = "none";
    }, 5800);

    // Smart Music Fading Logic
    music.volume = 0.0; // Start at 0
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicBtn.innerHTML = "🔊";
            let fadeAudio = setInterval(() => {
                let nextVol = music.volume + 0.05;
                if (nextVol < 0.95) {
                    music.volume = nextVol;
                } else {
                    music.volume = 1;
                    clearInterval(fadeAudio);
                }
            }, 75);
        }).catch((err) => {
            console.log("Auto-play prevented", err);
            musicBtn.innerHTML = "🔇";
        });
    }
});


// --- 2. MULTI-LAYER HERO PARALLAX DEPTH ---
// Listen to mouse movement and shift the background layer inversely
document.getElementById("hero-section").addEventListener("mousemove", (e) => {
    // Only fetch movements if window width > 768px to avoid mobile weirdness
    if (window.innerWidth > 768) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        document.getElementById("hero-bg").style.transform = `translate(${xAxis}px, ${yAxis}px)`;
    }
});
// Reset back when mouse leaves
document.getElementById("hero-section").addEventListener("mouseleave", () => {
    document.getElementById("hero-bg").style.transform = `translate(0px, 0px)`;
});

// Floating Music Button global toggle with fading transition
let isFading = false;
musicBtn.addEventListener("click", () => {
    if (isFading) return;
    isFading = true;

    if (music.paused) {
        music.volume = 0;
        music.play();
        musicBtn.innerHTML = "🔊";

        let fadeUp = setInterval(() => {
            let nextVol = music.volume + 0.1;
            if (nextVol < 0.9) {
                music.volume = nextVol;
            } else {
                music.volume = 1;
                isFading = false;
                clearInterval(fadeUp);
            }
        }, 50);
    } else {
        // Fade out
        let fadeDown = setInterval(() => {
            let nextVol = music.volume - 0.1;
            if (nextVol > 0.1) {
                music.volume = nextVol;
            } else {
                music.volume = 0;
                music.pause();
                musicBtn.innerHTML = "🎵";
                isFading = false;
                clearInterval(fadeDown);
            }
        }, 50);
    }
});


// --- 7. LIGHTBOX GALLERY ---
function showImageModal(src) {
    document.getElementById("lightbox-img").src = src;
}


// --- 8. MAP ZOOM ANIMATION ON LOAD ---
let mapIframe = document.getElementById("g-map");
if (mapIframe) {
    mapIframe.addEventListener('load', () => {
        mapIframe.classList.add('zoom-map');
        setTimeout(() => mapIframe.classList.remove('zoom-map'), 1000);
    });
}


// --- 9. COUNTDOWN ---
const countdownDiv = document.getElementById("countdown");
const weddingDate = new Date("Dec 12, 2026 10:00:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const gap = weddingDate - now;

    if (gap > 0) {
        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap / (1000 * 60 * 60)) % 24);
        const m = Math.floor((gap / (1000 * 60)) % 60);
        const s = Math.floor((gap / 1000) % 60);

        countdownDiv.innerHTML = `
            <div class="countdown-block"><h3>${d}</h3><p>Days</p></div>
            <div class="countdown-block"><h3>${h}</h3><p>Hours</p></div>
            <div class="countdown-block"><h3>${m}</h3><p>Mins</p></div>
            <div class="countdown-block"><h3>${s}</h3><p>Secs</p></div>
        `;
    } else {
        countdownDiv.innerHTML = `<h3 class="playfair">It's Wedding Day! 🎉</h3>`;
    }
}, 1000);


// --- 10. RSVP FORM HANDLING WITH VICTORY CONFETTI ---
document.getElementById("rsvpForm").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;

    // --- CUSTOM VALIDATION ---
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const attendanceInputs = form.querySelectorAll('input[name="attendance"]');
    const errorDiv = document.getElementById("form-error");

    // Reset styles
    nameInput.style.borderColor = "";
    phoneInput.style.borderColor = "";
    errorDiv.classList.add("d-none");
    errorDiv.innerHTML = "";

    let errors = [];

    if (nameInput.value.trim().length < 2) {
        nameInput.style.borderColor = "#da3333";
        errors.push("• Please politely provide your guest name.");
    }

    // Validates international formats + spaces/hyphens (e.g. +94 77 123 4567)
    const phoneRegex = /^[+]?[\d\s-]{9,16}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.style.borderColor = "#da3333";
        errors.push("• Please provide a valid 9-15 digit phone number.");
    }

    let attendanceChecked = false;
    attendanceInputs.forEach(radio => { if (radio.checked) attendanceChecked = true; });

    if (!attendanceChecked) {
        errors.push("• Please let us know if you will be attending.");
    }

    if (errors.length > 0) {
        errorDiv.innerHTML = errors.join("<br>");
        errorDiv.classList.remove("d-none");
        return; // Break intercept
    }
    // --- END VALIDATION ---

    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    try {
        // --- SERVERLESS RSVP SETUP ---
        const YOUR_EMAIL = "vindulasavindu@gmail.com"; // 👈 PUT YOUR REAL EMAIL HERE

        if (YOUR_EMAIL.includes("your_actual_email")) {
            alert("STOP: Open frontend/js/script.js (Line 252) and type your real email address right there to enable RSVPs!");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        const response = await fetch("https://formsubmit.co/ajax/" + YOUR_EMAIL, {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        // FormSubmit returns data.success === "true"
        if (data.success === "true" || data.status === "success") {
            // TIKTOK TREND: Confetti Heart/Gold explosion on victory
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.7 },
                    colors: ['#C8A96A', '#e2c079', '#ffffff', '#ff0000']
                });
            }

            const formContainer = document.getElementById("rsvp-form-container");
            const successBlock = document.getElementById("rsvp-success");

            formContainer.classList.add("rs-transition");
            formContainer.style.opacity = 0;

            setTimeout(() => {
                formContainer.style.display = "none";

                successBlock.classList.add("rs-transition");
                successBlock.style.opacity = 0;
                successBlock.style.display = "block";

                setTimeout(() => {
                    successBlock.style.opacity = 1;
                }, 50);

            }, 500);

        } else {
            alert("Oops! " + data.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error submitting RSVP:", error);
        alert("An error occurred. Please try again later.");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});
