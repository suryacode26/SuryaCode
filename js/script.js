/* =========================================================
   INTRO
========================================================= */
const landing=document.getElementById("landing");
const firstS=document.getElementById("firstS");
const word=document.getElementById("word");
const finalSC=document.getElementById("finalSC");
const finalWord=document.getElementById("finalWord");
const mainContent=document.getElementById("main-content");
let introDone=false;

function enterSite(){
    if(introDone)return;
    introDone=true;
    landing.classList.add("hide");
    document.body.classList.remove("locked");
    setTimeout(()=>mainContent.classList.add("show"),250);
}

window.addEventListener("load",()=>{
    setTimeout(()=>{
        word.classList.add("active");
        setTimeout(()=>{
            firstS.style.opacity="0";
            firstS.style.transform="translate(-50%,-50%) scale(.45)";
        },120);
    },1850);

    setTimeout(()=>finalSC.classList.add("show"),2750);

    setTimeout(()=>{
        word.style.opacity="0";
        finalWord.classList.add("show");
    },3450);

    setTimeout(enterSite,5000);
});
landing.addEventListener("click",enterSite);

/* =========================================================
   NAVIGATION
========================================================= */
const menuBtn=document.getElementById("menuBtn");
const mobileMenu=document.getElementById("mobileMenu");
const mobileMenuBackdrop=document.getElementById("mobileMenuBackdrop");

function setMobileMenu(open){
    mobileMenu.classList.toggle("open",open);
    menuBtn.classList.toggle("is-open",open);
    menuBtn.setAttribute("aria-expanded",String(open));
    menuBtn.setAttribute("aria-label",open?"Close menu":"Open menu");
    document.body.classList.toggle("locked",open);
    if(mobileMenuBackdrop) mobileMenuBackdrop.classList.toggle("open",open);
}
menuBtn.addEventListener("click",()=>setMobileMenu(!mobileMenu.classList.contains("open")));
if(mobileMenuBackdrop) mobileMenuBackdrop.addEventListener("click",()=>setMobileMenu(false));
mobileMenu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMobileMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape") setMobileMenu(false)});
window.addEventListener("resize",()=>{if(window.innerWidth>900) setMobileMenu(false)});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click",e=>{
        const id=a.getAttribute("href");
        if(id && id!=="#"){
            const target=document.querySelector(id);
            if(target){
                e.preventDefault();
                target.scrollIntoView({behavior:"smooth",block:"start"});
            }
        }
    });
});

/* =========================================================
   SCROLL REVEAL
========================================================= */
const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach((el,i)=>{
    el.style.transitionDelay=`${Math.min(i%6,5)*70}ms`;
    observer.observe(el);
});

/* =========================================================
   FAQ
========================================================= */
document.querySelectorAll(".faq-item").forEach(item=>{
    item.querySelector(".faq-q").addEventListener("click",()=>{
        const open=item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(x=>x.classList.remove("open"));
        if(!open)item.classList.add("open");
    });
});

/* =========================================================
   CONTACT FORM
========================================================= */
const toast=document.getElementById("toast");
function showToast(text){
    toast.textContent=text;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),3200);
}
document.getElementById("projectForm").addEventListener("submit",e=>{
    e.preventDefault();

    const data=new FormData(e.target);
    const clean=value=>String(value||"-").trim();

    const name=clean(data.get("name"));
    const business=clean(data.get("business"));
    const email=clean(data.get("email"));
    const phone=clean(data.get("phone"));
    const service=clean(data.get("service"));
    const requirement=clean(data.get("message"));

    // Keep the WhatsApp enquiry clean and simple.
    // The decorative SURYA CODE enquiry header/footer is intentionally removed.
    const whatsappMessage=[
        `Name: ${name}`,
        `Business: ${business}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        `Requirement: ${requirement}`
    ].join("\n");

    const whatsappUrl=
        `https://wa.me/916379295869?text=${encodeURIComponent(whatsappMessage)}`;

    showToast("Opening WhatsApp with your enquiry...");
    window.open(whatsappUrl,"_blank","noopener");

    setTimeout(()=>e.target.reset(),350);
});

/* =========================================================
   CHATBOT — RULE-BASED FRONTEND DEMO
   Replace getBotReply() with your API call later if needed.
========================================================= */
const chatToggle=document.getElementById("chatToggle");
const chatPanel=document.getElementById("chatPanel");
const chatClose=document.getElementById("chatClose");
const chatMessages=document.getElementById("chatMessages");
const chatForm=document.getElementById("chatForm");
const chatInput=document.getElementById("chatInput");

chatToggle.addEventListener("click",()=>chatPanel.classList.toggle("open"));
chatClose.addEventListener("click",()=>chatPanel.classList.remove("open"));

function addMessage(text,type){
    const div=document.createElement("div");
    div.className=`msg ${type}`;
    div.textContent=text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop=chatMessages.scrollHeight;
}
function getBotReply(q){
    const x=q.toLowerCase();
    if(/hello|hi|hey/.test(x)) return "Hi! 👋 Tell me what kind of website or software you need.";
    if(/website|web site|web/.test(x)) return "SURYA CODE can create responsive business websites, landing pages, portfolios, service websites and website + admin systems.";
    if(/billing|pos|invoice|shop|supermarket/.test(x)) return "We can build billing/POS workflows with products, billing, orders, payments, inventory and reports based on your business needs.";
    if(/software|application|app|desktop|electron|windows/.test(x)) return "Custom business software and Windows Electron applications can be planned around your workflow.";
    if(/price|cost|rate|budget/.test(x)) return "Pricing depends on pages, modules, integrations and support. Use the project form to request a custom quote.";
    if(/contact|email|mail|phone|mobile|whatsapp|number/.test(x)) return "You can contact SURYA CODE at +91 63792 95869 (Phone / WhatsApp) or suryacode26@gmail.com. You can also use the project enquiry form on this page.";
    if(/seo|google|ranking|rank|search|discover|ai|chatgpt|gemini|copilot|perplexity|visibility/.test(x)) return "SURYA CODE websites are built with SEO-friendly structure, useful content, structured data, responsive design and clear service information to improve search and AI discovery. No agency can honestly guarantee #1 rankings or first recommendations everywhere.";
    if(/language|tamil|தமிழ்/.test(x)) return "ஆம்! நீங்கள் உங்கள் தேவையை தமிழில் எழுதலாம். தேவையைப் புரிந்து அதற்கேற்ற பதிலை வழங்க இந்த assistant-ஐ பின்னர் API/AI backend-க்கு இணைக்கலாம்.";
    return "I can help with websites, billing/POS, custom software, Electron desktop apps, SEO, AI discovery, pricing and project enquiries. Tell me what you need.";
}
function sendChat(q){
    q=q.trim();
    if(!q)return;
    addMessage(q,"user");
    chatInput.value="";
    setTimeout(()=>addMessage(getBotReply(q),"bot"),350);
}
chatForm.addEventListener("submit",e=>{e.preventDefault();sendChat(chatInput.value)});
document.querySelectorAll(".chat-suggest button").forEach(b=>b.addEventListener("click",()=>sendChat(b.dataset.q)));


/* =========================================================
   V23 — SELECTED DIRECTIONS / BILLING & POS SEARCH ANIMATION
   The animation lives only inside the first Work card.
========================================================= */
(() => {
    const demo = document.querySelector(".work-pos .pos-search-demo");
    if(!demo) return;

    const queryEl = demo.querySelector("[data-pos-query]");
    const suggestions = [...demo.querySelectorAll(".pos-suggestion")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const searches = [
        {
            query:"vanilla",
            items:[
                ["Vanilla Fresh Cream Cake","₹270"],
                ["Black Forest 600G","₹290"],
                ["Butter Scotch 1KG","₹650"]
            ]
        },
        {
            query:"black",
            items:[
                ["Black Forest 600G","₹290"],
                ["Black Forest 1KG","₹560"],
                ["Black Forest Slice","₹90"]
            ]
        },
        {
            query:"butter",
            items:[
                ["Butter Scotch 1KG","₹650"],
                ["Butter Scotch 500G","₹340"],
                ["Butter Scotch Slice","₹110"]
            ]
        }
    ];

    let searchIndex = 0;
    let timer = null;
    let typingTimer = null;

    function paintResults(data){
        suggestions.forEach((row,index)=>{
            const [name,price] = data.items[index];
            const nameEl = row.querySelector("span");
            const priceEl = row.querySelector("b");
            if(nameEl) nameEl.textContent = name;
            if(priceEl) priceEl.textContent = price;
            row.style.animation = "none";
            row.offsetHeight;
            row.style.animation = "";
        });
    }

    function typeQuery(text, done){
        clearInterval(typingTimer);
        queryEl.textContent = "";
        let i = 0;

        typingTimer = setInterval(()=>{
            queryEl.textContent = text.slice(0, ++i);
            if(i >= text.length){
                clearInterval(typingTimer);
                typingTimer = null;
                if(done) window.setTimeout(done, 180);
            }
        }, 95);
    }

    function runSearch(){
        const data = searches[searchIndex];

        demo.classList.remove("search-active");
        clearTimeout(timer);

        window.setTimeout(()=>{
            paintResults(data);

            if(reduced){
                queryEl.textContent = data.query;
                demo.classList.add("search-active");
                return;
            }

            typeQuery(data.query, ()=>{
                demo.classList.add("search-active");

                timer = window.setTimeout(()=>{
                    demo.classList.remove("search-active");

                    window.setTimeout(()=>{
                        searchIndex = (searchIndex + 1) % searches.length;
                        runSearch();
                    }, 650);
                }, 3200);
            });
        }, 250);
    }

    const start = () => runSearch();

    if("IntersectionObserver" in window){
        const observer = new IntersectionObserver(entries=>{
            if(entries.some(entry=>entry.isIntersecting)){
                start();
                observer.disconnect();
            }
        },{threshold:.35});

        observer.observe(demo.closest(".work-card") || demo);
    }else{
        start();
    }

    window.addEventListener("pagehide",()=>{
        clearInterval(typingTimer);
        clearTimeout(timer);
    });
})();


/* =========================================================
   HERO SHOWCASE — AUTO PRODUCT PRESENTATION
========================================================= */
const showcaseWindows = [...document.querySelectorAll(".product-window")];

if(showcaseWindows.length === 3){
    let showcaseIndex = 0;

    function updateShowcase(){
        showcaseWindows.forEach((win, i)=>{
            win.classList.remove("showcase-active","showcase-mid","showcase-back");

            const position = (i - showcaseIndex + showcaseWindows.length) % showcaseWindows.length;

            if(position === 0){
                win.classList.add("showcase-active");
            }else if(position === 1){
                win.classList.add("showcase-mid");
            }else{
                win.classList.add("showcase-back");
            }
        });

        const counter = document.querySelector(".showcase-label span");
        if(counter){
            counter.textContent =
                String(showcaseIndex + 1).padStart(2,"0") + " — 03";
        }
    }

    updateShowcase();

    setInterval(()=>{
        if(!document.hidden){
            showcaseIndex = (showcaseIndex + 1) % showcaseWindows.length;
            updateShowcase();
        }
    },4200);
}


/* =========================================================
   SERVICES V13 — INTERACTIVE SERVICE PRESENTATION
========================================================= */
(() => {
    const showcase = document.getElementById("serviceShowcase");
    if(!showcase) return;

    const items = [...showcase.querySelectorAll(".service-item")];
    const stage = showcase.querySelector(".service-stage");
    const code = document.getElementById("serviceStageCode");
    const status = document.getElementById("serviceStageStatus");
    const number = document.getElementById("serviceStageNumber");
    const kicker = document.getElementById("serviceStageKicker");
    const title = document.getElementById("serviceStageTitle");
    const description = document.getElementById("serviceStageDescription");
    const tags = document.getElementById("serviceStageTags");
    const progress = document.getElementById("serviceStageProgress");

    const data = [
        {
            code:"01 / WEB", kicker:"WEB DEVELOPMENT", title:"Business Websites",
            description:"Professional, responsive websites for shops, companies, services, portfolios and growing brands.",
            tags:["Responsive","SEO Ready","Fast"]
        },
        {
            code:"02 / APP", kicker:"CUSTOM DEVELOPMENT", title:"Custom Software",
            description:"Business applications designed around your workflow, data and daily operations.",
            tags:["Workflow","Automation","Scalable"]
        },
        {
            code:"03 / POS", kicker:"BILLING SYSTEMS", title:"Billing & POS",
            description:"Billing, inventory, orders, reports and payment workflows for retail, food and service businesses.",
            tags:["Billing","Inventory","Reports"]
        },
        {
            code:"04 / DESKTOP", kicker:"ELECTRON DESKTOP", title:"Electron Apps",
            description:"Windows desktop applications with modern web technology and a native-app experience.",
            tags:["Windows","Offline","Desktop"]
        },
        {
            code:"05 / UI", kicker:"UI / UX DESIGN", title:"UI / UX Design",
            description:"Clean, premium interfaces that make complex business features easier for staff and customers.",
            tags:["Interface","Usability","Systems"]
        },
        {
            code:"06 / CARE", kicker:"LONG-TERM SUPPORT", title:"Support & Updates",
            description:"Bug fixes, improvements, maintenance and feature updates as your business grows.",
            tags:["Maintenance","Fixes","Updates"]
        }
    ];

    let active = 0;
    let timer;

    function render(index, animate=true){
        active = index;
        const d = data[index];

        items.forEach((item,i)=>{
            item.classList.toggle("active",i===index);
            item.setAttribute("aria-selected",i===index ? "true":"false");
        });

        if(animate){
            stage.classList.add("changing");
            window.setTimeout(()=>apply(d,index),260);
        }else{
            apply(d,index);
        }
    }

    function serviceVisual(index){
        const visuals = [
            `
            <div class="service-visual sv-web">
                <div class="web-browser">
                    <div class="web-browser-top"><i></i><i></i><i></i><span>surya-code / business</span></div>
                    <div class="web-layout">
                        <div class="web-copy"><b></b><i></i><i></i><em></em></div>
                        <div class="web-page">
                            <div class="hero-line"></div>
                            <div class="hero-line gold"></div>
                            <div class="tiles"><i></i><i></i><i></i></div>
                        </div>
                    </div>
                </div>
                <div class="responsive-orbit"></div>
            </div>
            `,
            `
            <div class="service-visual sv-software">
                <div class="workflow-line"></div>
                <div class="workflow-node"><i></i><b>INPUT</b><span>Orders</span></div>
                <div class="workflow-node"><i></i><b>PROCESS</b><span>Automation</span></div>
                <div class="workflow-node"><i></i><b>OUTPUT</b><span>Reports</span></div>
                <div class="workflow-node"><i></i><b>DATA</b><span>Database</span></div>
                <div class="workflow-node"><i></i><b>ACTION</b><span>Workflow</span></div>
                <div class="workflow-core"><strong>SC</strong></div>
            </div>
            `,
            `
            <div class="service-visual sv-pos">
                <div class="pos-window">
                    <div class="pos-top"><i></i><i></i><i></i><span>SURYA CODE / POS</span></div>
                    <div class="pos-search"><span class="magnify">⌕</span><span class="typed">vanilla</span><span class="cursor"></span></div>
                    <div class="pos-results">
                        <div class="pos-result"><strong>Vanilla Fresh Cream Cake</strong><b>₹270</b></div>
                        <div class="pos-result"><strong>Black Forest 600G</strong><b>₹290</b></div>
                        <div class="pos-result"><strong>Butter Scotch 1KG</strong><b>₹650</b></div>
                    </div>
                    <div class="pos-cart"><i></i><i></i><i></i></div>
                </div>
            </div>
            `,
            `
            <div class="service-visual sv-electron">
                <div class="desktop-shell">
                    <div class="desktop-title">
                        <span>SURYA CODE / DESKTOP</span>
                        <div class="desktop-controls"><span>—</span><span>□</span><span>×</span></div>
                    </div>
                    <div class="desktop-body">
                        <div class="desktop-side"><i></i><i></i><i></i><i></i><i></i></div>
                        <div class="desktop-main">
                            <div class="electron-ring"></div>
                            <div class="electron-ring r2"></div>
                            <div class="electron-logo">SC</div>
                            <div class="electron-status">● OFFLINE READY</div>
                        </div>
                    </div>
                </div>
            </div>
            `,
            `
            <div class="service-visual sv-uiux">
                <div class="design-board">
                    <div class="design-toolbar"><i></i><i></i><i></i><span>SC DESIGN SYSTEM / UI</span></div>
                    <div class="design-canvas">
                        <div class="phone-frame"><b></b><i></i><i></i><div class="phone-card"></div><div class="phone-card"></div></div>
                        <div class="desktop-frame"><b></b><div class="ui-row"><i></i><i></i><i></i></div></div>
                        <div class="design-cursor"></div>
                    </div>
                </div>
            </div>
            `,
            `
            <div class="service-visual sv-support">
                <div class="support-ring"></div>
                <div class="support-core"><strong>24/7</strong><small>SUPPORT</small></div>
                <div class="support-badge">SYSTEM ACTIVE</div>
                <div class="support-line"></div>
                <div class="support-step s1"><span>FIX</span></div>
                <div class="support-step s2"><span>UPDATE</span></div>
                <div class="support-step s3"><span>IMPROVE</span></div>
                <div class="support-step s4"><span>GROW</span></div>
            </div>
            `
        ];
        return visuals[index] || visuals[0];
    }

    function apply(d,index){
        code.textContent=d.code;
        status.textContent="AVAILABLE";
        number.textContent=String(index+1).padStart(2,"0");
        kicker.textContent=d.kicker;
        title.textContent=d.title;
        description.textContent=d.description;
        tags.innerHTML=d.tags.map(t=>`<span>${t}</span>`).join("");
        progress.style.width=((index+1)/data.length*100)+"%";

        const visual = document.getElementById("serviceStageVisual");
        if(visual){
            visual.className = "stage-visual visual-type-" + index;
            visual.innerHTML = serviceVisual(index);
        }

        stage.classList.remove("changing");
    }

    items.forEach((item,i)=>{
        item.addEventListener("click",()=>{
            render(i);
            resetTimer();
        });
        item.addEventListener("mouseenter",()=>{
            if(window.innerWidth > 900) render(i);
        });
    });

    function resetTimer(){
        clearInterval(timer);
        timer=setInterval(()=>{
            if(!document.hidden) render((active+1)%data.length);
        },5000);
    }

    render(0,false);
    resetTimer();
})();


/* =========================================================
   V15 — SCROLL REVEAL ENGINE
========================================================= */
(() => {
    const animated = [
        ...document.querySelectorAll(".reveal"),
        ...document.querySelectorAll(".process-grid > *"),
        ...document.querySelectorAll(".services-v13 .service-item")
    ];

    if(!animated.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced || !("IntersectionObserver" in window)){
        animated.forEach(el => el.classList.add("revealed"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(!entry.isIntersecting) return;

            const el = entry.target;
            const parent = el.parentElement;
            const siblings = parent ? [...parent.children] : [];
            const index = Math.max(0, siblings.indexOf(el));

            el.style.transitionDelay = `${Math.min(index * 90, 450)}ms`;
            el.classList.add("revealed");

            obs.unobserve(el);
        });
    }, {
        threshold:.14,
        rootMargin:"0px 0px -8% 0px"
    });

    animated.forEach(el => observer.observe(el));
})();

/* =========================================================
   YEAR
========================================================= */
document.getElementById("year").textContent=new Date().getFullYear();

/* =========================================================
   THEME SWITCHER — LUXURY GOLD / MIDNIGHT CYAN
========================================================= */
(() => {
    const STORAGE_KEY = "suryaCodeTheme";
    const themes = {
        gold: {
            label: "Luxury Gold",
            title: "Luxury Gold",
            accent: "var(--gold)"
        },
        cyan: {
            label: "Midnight Cyan",
            title: "Midnight Cyan",
            accent: "#22d3ee"
        }
    };

    const desktopButton = document.getElementById("themeSwitcher");
    const mobileButton = document.getElementById("mobileThemeSwitcher");
    const buttons = [desktopButton, mobileButton].filter(Boolean);

    if (!buttons.length) return;

    function updateButtons(theme, animate = false){
        const data = themes[theme] || themes.gold;
        buttons.forEach(button => {
            button.dataset.themeLabel = data.label;
            button.title = data.title;
            button.setAttribute("aria-label", `Change website theme. Current theme: ${data.label}`);
            if(animate){
                button.classList.remove("changed");
                void button.offsetWidth;
                button.classList.add("changed");
                setTimeout(() => button.classList.remove("changed"), 750);
            }
        });
    }

    function runThemePaintTransition(nextTheme){
        const transition = document.getElementById("theme-paint-transition");
        if(!transition){
            document.body.dataset.theme = nextTheme;
            return;
        }

        // Set the target accent on the transition itself so the paint
        // always uses the new theme color.
        const target = themes[nextTheme] || themes.gold;
        const accentMap = {
            gold: "#c9a45c",
            cyan: "#22d3ee"
        };
        const rgbMap = {
            gold: "201,164,92",
            cyan: "34,211,238"
        };

        transition.style.setProperty("--theme-accent", accentMap[nextTheme] || accentMap.gold);
        transition.style.setProperty("--theme-accent-rgb", rgbMap[nextTheme] || rgbMap.gold);

        transition.classList.remove("active");
        void transition.offsetWidth;
        transition.classList.add("active");

        document.body.dataset.theme = nextTheme;

        window.setTimeout(() => {
            transition.classList.remove("active");
        }, 850);
    }

    function applyTheme(theme, animate = false){
        const nextTheme = themes[theme] ? theme : "gold";

        if(animate){
            runThemePaintTransition(nextTheme);
        }else{
            document.body.dataset.theme = nextTheme;
        }

        localStorage.setItem(STORAGE_KEY, nextTheme);
        updateButtons(nextTheme, animate);
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY) || "gold";
    applyTheme(savedTheme, false);

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const current = document.body.dataset.theme || "gold";
            const next = current === "gold" ? "cyan" : "gold";
            applyTheme(next, true);
        });
    });
})();

/* =========================================================
   ACTIVE NAV
========================================================= */
const navLinks=[...document.querySelectorAll(".nav-links a:not(.nav-cta)")];
const sections=[...document.querySelectorAll("section[id]")];
const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
        }
    });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>navObserver.observe(s));

/* =========================================================
   V20 — MOBILE VERTICAL STACK PROCESS
   Cards remain in one vertical column. Each card sticks while
   the next card scrolls up and takes its place.
========================================================= */
(() => {
    const section = document.querySelector(".process-mobile-story");
    const wrap = document.querySelector(".process-mobile-card-wrap");
    const progress = document.querySelector(".process-mobile-progress i");
    const counter = document.querySelector(".process-mobile-counter span:first-child");

    if(!section || !wrap || !progress || !counter) return;

    const cards = [...wrap.querySelectorAll(".process")];
    if(cards.length !== 4) return;

    const names = [
        ["01","DISCOVER"],
        ["02","DESIGN"],
        ["03","BUILD"],
        ["04","LAUNCH"]
    ];

    let ticking = false;

    function isMobile(){
        return window.matchMedia("(max-width:600px)").matches;
    }

    function update(){
        ticking = false;

        if(!isMobile()){
            cards.forEach(card => card.classList.remove("is-active","is-prev","is-next"));
            progress.style.width = "0%";
            return;
        }

        const viewport = window.innerHeight;
        let active = 0;
        let closest = Infinity;

        /*
          Find the card currently closest to its sticky position.
          This makes the progress/counter follow the card that has
          reached the top while the next card continuously approaches.
        */
        cards.forEach((card,index)=>{
            const rect = card.getBoundingClientRect();
            const target = [76,92,108,124][index];
            const distance = Math.abs(rect.top - target);

            if(rect.top <= target + 35 && distance < closest){
                closest = distance;
                active = index;
            }
        });

        cards.forEach((card,index)=>{
            card.classList.toggle("is-active", index === active);
            card.classList.toggle("is-prev", index < active);
            card.classList.toggle("is-next", index > active);
        });

        counter.innerHTML =
            `<b>${names[active][0]}</b> / ${names[active][1]}`;

        const sectionRect = section.getBoundingClientRect();
        const total = Math.max(1, section.offsetHeight - viewport);
        const passed = Math.max(0, Math.min(total, -sectionRect.top));
        const raw = passed / total;

        progress.style.width =
            `${Math.max(25, Math.min(100, raw * 100))}%`;
    }

    function requestUpdate(){
        if(ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, {passive:true});
    window.addEventListener("resize", requestUpdate, {passive:true});

    update();
})();

/* =========================================================
   V25 — PRICING SCROLL REVEAL + POINTER DEPTH
========================================================= */
(() => {
    const pricing = document.querySelector("#pricing");
    if (!pricing) return;

    const cards = [...pricing.querySelectorAll(".price-card")];

    // Reveal cards only when the pricing section enters the viewport.
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            cards.forEach((card, index) => {
                setTimeout(() => card.classList.add("pricing-visible"), index * 130);
            });

            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.18
    });

    observer.observe(pricing);

    // Subtle mouse depth effect on desktop.
    if (window.matchMedia("(pointer:fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        cards.forEach(card => {
            card.addEventListener("pointermove", event => {
                if (!card.classList.contains("pricing-visible")) return;

                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `translateY(-8px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }
})();

/* V27 — Why section micro-interaction */
(() => {
    const why = document.querySelector(".why-grid");
    if (!why || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = why.querySelectorAll(".why-item");

    if (window.matchMedia("(pointer:fine)").matches) {
        items.forEach(item => {
            item.addEventListener("pointermove", e => {
                const r = item.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top) / r.height) * 100;
                item.style.background = `
                    radial-gradient(
                        220px circle at ${x}% ${y}%,
                        rgba(var(--theme-accent-rgb),.075),
                        transparent 65%
                    ),
                    linear-gradient(
                        105deg,
                        rgba(255,255,255,.025),
                        rgba(255,255,255,.008)
                    )
                `;
            });

            item.addEventListener("pointerleave", () => {
                item.style.background = "";
            });
        });
    }
})();


/* =========================================================
   SURYA CODE — CURSOR FOLLOW + TOUCH RIPPLE
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