/* =========================================================
   SURYA CODE — shared script for inner (non-homepage) pages
   Mirrors the relevant parts of js/script.js but every lookup
   is null-guarded so a page that only has a subset of the
   homepage widgets (no intro, no chatbot, no contact form)
   never throws and never blocks the rest of the script.
========================================================= */

/* MOBILE MENU */
(() => {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
    if (!menuBtn || !mobileMenu) return;

    function setMobileMenu(open) {
        mobileMenu.classList.toggle("open", open);
        menuBtn.classList.toggle("is-open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        document.body.classList.toggle("locked", open);
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.toggle("open", open);
    }
    menuBtn.addEventListener("click", () => setMobileMenu(!mobileMenu.classList.contains("open")));
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener("click", () => setMobileMenu(false));
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMobileMenu(false)));
    document.addEventListener("keydown", e => { if (e.key === "Escape") setMobileMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) setMobileMenu(false); });
})();

/* SMOOTH SCROLL FOR IN-PAGE ANCHORS */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        if (id && id !== "#") {
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});

/* SCROLL REVEAL */
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
        observer.observe(el);
    });
} else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

/* FAQ ACCORDION */
document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
        const open = item.classList.contains("open");
        item.closest(".faq")?.querySelectorAll(".faq-item").forEach(x => x.classList.remove("open"));
        if (!open) item.classList.add("open");
    });
});

/* FOOTER YEAR */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* THEME SWITCHER — LUXURY GOLD / MIDNIGHT CYAN (same behaviour as homepage) */
(() => {
    const STORAGE_KEY = "suryaCodeTheme";
    const themes = {
        gold: { label: "Luxury Gold", title: "Luxury Gold" },
        cyan: { label: "Midnight Cyan", title: "Midnight Cyan" }
    };
    const desktopButton = document.getElementById("themeSwitcher");
    const mobileButton = document.getElementById("mobileThemeSwitcher");
    const buttons = [desktopButton, mobileButton].filter(Boolean);
    if (!buttons.length) return;

    function updateButtons(theme) {
        const data = themes[theme] || themes.gold;
        buttons.forEach(button => {
            button.dataset.themeLabel = data.label;
            button.title = data.title;
            button.setAttribute("aria-label", `Change website theme. Current theme: ${data.label}`);
        });
    }
    function applyTheme(theme) {
        const nextTheme = themes[theme] ? theme : "gold";
        document.body.dataset.theme = nextTheme;
        localStorage.setItem(STORAGE_KEY, nextTheme);
        updateButtons(nextTheme);
    }
    applyTheme(localStorage.getItem(STORAGE_KEY) || "gold");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const current = document.body.dataset.theme || "gold";
            applyTheme(current === "gold" ? "cyan" : "gold");
        });
    });
})();

/* ACTIVE NAV LINK — highlight the nav item for the current page's section.
   Each <body> carries data-nav-section (e.g. "services"), and each header /
   mobile-menu link carries a matching data-nav (e.g. data-nav="services").
   This also correctly marks "Services" active on its sub-pages like
   web-development/, billing-pos-software/, etc., and "Work" active on
   individual project pages — not just on exact URL matches. */
const currentSection = document.body.dataset.navSection;
if (currentSection) {
    document.querySelectorAll(
        `.nav-links a[data-nav="${currentSection}"], .mobile-menu a[data-nav="${currentSection}"]`
    ).forEach(a => a.classList.add("nav-current"));
}

/* Accessibility: reflect the active nav state to assistive tech too. */
document.querySelectorAll(".nav-links a.nav-current, .mobile-menu a.nav-current")
    .forEach(a => a.setAttribute("aria-current", "page"));

/* =========================================================
   SURYA CODE — CURSOR FOLLOW + TOUCH RIPPLE
   Same behaviour as the homepage. Requires #sc-pointer-glow
   and #sc-pointer-dot to be present in the page markup.
========================================================= */
(() => {
    const glow = document.getElementById("sc-pointer-glow");
    const dot = document.getElementById("sc-pointer-dot");

    if (!glow || !dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let active = false;

    const follow = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;

        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;

        dot.style.left = `${targetX}px`;
        dot.style.top = `${targetY}px`;

        requestAnimationFrame(follow);
    };

    follow();

    window.addEventListener("pointermove", (event) => {
        // Ignore multi-touch pointers.
        if (event.pointerType === "touch") return;

        targetX = event.clientX;
        targetY = event.clientY;

        if (!active) {
            active = true;
            glow.classList.add("visible");
            dot.classList.add("visible");
        }
    }, {passive:true});

    window.addEventListener("pointerleave", () => {
        active = false;
        glow.classList.remove("visible");
        dot.classList.remove("visible");
    }, {passive:true});

    const touchPoint = (x, y) => {
        const ripple = document.createElement("span");
        ripple.className = "sc-touch-ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);

        const count = 8;

        for(let i = 0; i < count; i++){
            const spark = document.createElement("span");
            spark.className = "sc-touch-spark";

            const angle = (Math.PI * 2 / count) * i + Math.random() * .35;
            const distance = 22 + Math.random() * 34;

            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.setProperty("--sx", `${Math.cos(angle) * distance}px`);
            spark.style.setProperty("--sy", `${Math.sin(angle) * distance}px`);

            document.body.appendChild(spark);

            spark.addEventListener("animationend", () => spark.remove(), {once:true});
        }

        ripple.addEventListener("animationend", () => ripple.remove(), {once:true});
    };

    window.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
            touchPoint(event.clientX, event.clientY);
        }
    }, {passive:true});
})();

/* =========================================================
   SURYA CODE ASSISTANT — CHATBOT
   Same rule-based demo used on the homepage, mirrored here so
   every page has the full widget with all reply topics.
   Replace getBotReply() with a real API call later if needed.
========================================================= */
(() => {
    const chatToggle = document.getElementById("chatToggle");
    const chatPanel = document.getElementById("chatPanel");
    const chatClose = document.getElementById("chatClose");
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");

    if (!chatToggle || !chatPanel || !chatMessages || !chatForm || !chatInput) return;

    chatToggle.addEventListener("click", () => chatPanel.classList.toggle("open"));
    if (chatClose) chatClose.addEventListener("click", () => chatPanel.classList.remove("open"));

    function addMessage(text, type) {
        const div = document.createElement("div");
        div.className = `msg ${type}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotReply(q) {
        const x = q.toLowerCase();
        if (/hello|hi|hey/.test(x)) return "Hi! 👋 Tell me what kind of website or software you need.";
        if (/website|web site|web/.test(x)) return "SURYA CODE can create responsive business websites, landing pages, portfolios, service websites and website + admin systems.";
        if (/billing|pos|invoice|shop|supermarket/.test(x)) return "We can build billing/POS workflows with products, billing, orders, payments, inventory and reports based on your business needs.";
        if (/software|application|app|desktop|electron|windows/.test(x)) return "Custom business software and Windows Electron applications can be planned around your workflow.";
        if (/price|cost|rate|budget/.test(x)) return "Pricing depends on pages, modules, integrations and support. Use the project form to request a custom quote.";
        if (/contact|email|mail|phone|mobile|whatsapp|number/.test(x)) return "You can contact SURYA CODE at +91 63792 95869 (Phone / WhatsApp) or suryacode26@gmail.com. You can also use the project enquiry form on this page.";
        if (/seo|google|ranking|rank|search|discover|ai|chatgpt|gemini|copilot|perplexity|visibility/.test(x)) return "SURYA CODE websites are built with SEO-friendly structure, useful content, structured data, responsive design and clear service information to improve search and AI discovery. No agency can honestly guarantee #1 rankings or first recommendations everywhere.";
        if (/language|tamil|தமிழ்/.test(x)) return "ஆம்! நீங்கள் உங்கள் தேவையை தமிழில் எழுதலாம். தேவையைப் புரிந்து அதற்கேற்ற பதிலை வழங்க இந்த assistant-ஐ பின்னர் API/AI backend-க்கு இணைக்கலாம்.";
        return "I can help with websites, billing/POS, custom software, Electron desktop apps, SEO, AI discovery, pricing and project enquiries. Tell me what you need.";
    }

    function sendChat(q) {
        q = q.trim();
        if (!q) return;
        addMessage(q, "user");
        chatInput.value = "";
        setTimeout(() => addMessage(getBotReply(q), "bot"), 350);
    }

    chatForm.addEventListener("submit", e => { e.preventDefault(); sendChat(chatInput.value); });
    document.querySelectorAll(".chat-suggest button").forEach(b =>
        b.addEventListener("click", () => sendChat(b.dataset.q))
    );
})();
