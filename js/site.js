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

/* ACTIVE NAV LINK — highlight the nav item matching the current path */
document.querySelectorAll(".nav-links a:not(.nav-cta), .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) return;
    // Resolve the (relative) href against the current page so it can be
    // compared with location.pathname, which is always absolute. This also
    // makes the comparison work correctly under a GitHub Pages project
    // subpath (e.g. /SuryaCode/about/) instead of only at the site root.
    const resolved = new URL(href, location.href).pathname.replace(/index\.html$/, "");
    const current = location.pathname.replace(/index\.html$/, "");
    if (resolved && (current === resolved || current === resolved.replace(/\/$/, ""))) {
        a.classList.add("nav-current");
    }
});
