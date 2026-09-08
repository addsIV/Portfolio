// Scroll-driven interactions: progress bar, staggered reveals, experience rail,
// metric count-ups, section dot navigation, header parallax, card spotlight.
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isZh = () => document.body.classList.contains('chinese-mode');
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    document.addEventListener('DOMContentLoaded', () => {
        const v = document.querySelector('meta[name="app-version"]');
        if (v) console.info('Portfolio build', v.content);
        setupProgressBar();
        setupReveals();
        setupMetrics();
        setupExperienceRail();
        setupSectionNav();
        setupParallax();
        setupSpotlight();
        setupIdentityPill();
        startScrollLoop();
    });

    /* ---------- shared scroll loop (one rAF for everything) ---------- */
    const scrollHandlers = [];
    function onScroll(fn) { scrollHandlers.push(fn); }
    function startScrollLoop() {
        let ticking = false;
        const run = () => {
            ticking = false;
            const y = window.scrollY || document.documentElement.scrollTop;
            for (const fn of scrollHandlers) fn(y);
        };
        const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
        window.addEventListener('scroll', request, { passive: true });
        window.addEventListener('resize', request);
        run();
    }

    /* ---------- 1. top progress bar ---------- */
    function setupProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);
        onScroll((y) => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
        });
    }

    /* ---------- 2. staggered reveals ---------- */
    const revealed = new Set();
    function setupReveals() {
        const groups = [
            { selector: '.section-title', step: 0 },
            { selector: '.about-item', step: 120 },
            { selector: '.experience-item', step: 140 },
            { selector: '.education-item', step: 120 },
            { selector: '.skill-category', step: 120 },
            { selector: '.skills-list .skill-tag', step: 45, perParent: true },
            { selector: '.tech-badge', step: 120 },
        ];
        const targets = [];
        for (const g of groups) {
            const counters = new Map();
            document.querySelectorAll(g.selector).forEach((el, i) => {
                let idx = i;
                if (g.perParent) {
                    const p = el.parentElement;
                    idx = counters.get(p) || 0;
                    counters.set(p, idx + 1);
                }
                el.classList.add('reveal');
                el.style.setProperty('--d', `${idx * g.step}ms`);
                targets.push(el);
            });
        }
        if (reduceMotion) {
            targets.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (!e.isIntersecting) continue;
                e.target.classList.add('is-visible');
                revealed.add(e.target);
                io.unobserve(e.target);
                e.target.dispatchEvent(new CustomEvent('reveal', { bubbles: true }));
            }
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        targets.forEach((el) => io.observe(el));
    }

    /* ---------- 3. metric highlight + count-up ---------- */
    // Matches "5+", "1M+", "50+", "90%", and the Chinese "100萬+".
    const METRIC_RE = /(\d+(?:\.\d+)?)(萬\+|M\+|\+|%)/g;
    function setupMetrics() {
        const hosts = () => document.querySelectorAll('[data-en][data-zh]');
        const wrap = (el) => {
            const text = el.textContent;
            if (!METRIC_RE.test(text)) return;
            METRIC_RE.lastIndex = 0;
            el.innerHTML = escapeHtml(text).replace(METRIC_RE, (m, num, suffix) =>
                `<span class="metric" data-target="${num}" data-suffix="${suffix}">${num}${suffix}</span>`);
        };
        const applyAll = () => hosts().forEach(wrap);
        applyAll();

        // Language toggle rewrites textContent; re-wrap afterwards.
        new MutationObserver(() => {
            applyAll();
            // Already-revealed hosts: no second count-up, just show final values.
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        if (reduceMotion) return;
        document.addEventListener('reveal', (e) => {
            e.target.querySelectorAll('.metric').forEach(countUp);
        });
        // Header badges and about paragraphs live in the header/about cards.
    }
    function countUp(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const target = parseFloat(el.dataset.target);
        const decimals = (el.dataset.target.split('.')[1] || '').length;
        const suffix = el.dataset.suffix;
        const duration = 900;
        const start = performance.now();
        const tick = (now) => {
            const t = clamp((now - start) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    /* ---------- 4. experience rail that draws as you scroll ---------- */
    function setupExperienceRail() {
        const section = document.querySelector('.experience-section');
        const items = section ? [...section.querySelectorAll('.experience-item')] : [];
        if (!section || items.length === 0) return;

        const rail = document.createElement('div');
        rail.className = 'exp-rail';
        rail.innerHTML = '<div class="exp-rail-track"></div><div class="exp-rail-fill"></div>';
        const fill = rail.querySelector('.exp-rail-fill');
        const dots = items.map(() => {
            const d = document.createElement('div');
            d.className = 'exp-rail-dot';
            rail.appendChild(d);
            return d;
        });
        section.appendChild(rail);

        let top = 0, height = 1;
        const layout = () => {
            const first = items[0], last = items[items.length - 1];
            top = first.offsetTop;
            height = last.offsetTop + last.offsetHeight - top;
            rail.style.top = `${top}px`;
            rail.style.height = `${height}px`;
            items.forEach((it, i) => { dots[i].style.top = `${it.offsetTop - top + 34}px`; });
        };
        layout();
        window.addEventListener('resize', layout);
        window.addEventListener('load', layout);

        onScroll(() => {
            const rect = rail.getBoundingClientRect();
            const focus = window.innerHeight * 0.55;
            const p = clamp((focus - rect.top) / rect.height, 0, 1);
            fill.style.transform = `scaleY(${p})`;
            items.forEach((it, i) => {
                const lit = it.getBoundingClientRect().top + 34 <= focus;
                dots[i].classList.toggle('is-lit', lit);
                it.classList.toggle('is-current', lit && (i === items.length - 1 || items[i + 1].getBoundingClientRect().top + 34 > focus));
            });
        });
    }

    /* ---------- 5. section dot navigation ---------- */
    function setupSectionNav() {
        const header = document.querySelector('.header');
        const sections = [...document.querySelectorAll('.section')];
        if (!header || sections.length === 0) return;

        const entries = [{ el: header, en: 'Top', zh: '頂部' }].concat(sections.map((s) => {
            const label = s.querySelector('.section-title [data-en]');
            return { el: s, en: label ? label.dataset.en : '', zh: label ? label.dataset.zh : '' };
        }));

        const nav = document.createElement('nav');
        nav.className = 'section-nav';
        nav.setAttribute('aria-label', 'Sections');
        const buttons = entries.map((e) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'section-nav-dot';
            b.dataset.labelEn = e.en;
            b.dataset.labelZh = e.zh;
            b.setAttribute('aria-label', isZh() ? e.zh : e.en);
            b.innerHTML = `<span class="section-nav-label"></span>`;
            b.addEventListener('click', () => {
                const y = e.el.getBoundingClientRect().top + window.scrollY - 24;
                window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
            nav.appendChild(b);
            return b;
        });
        document.body.appendChild(nav);

        const relabel = () => buttons.forEach((b) => {
            const t = isZh() ? b.dataset.labelZh : b.dataset.labelEn;
            b.querySelector('.section-nav-label').textContent = t;
            b.setAttribute('aria-label', t);
        });
        relabel();
        new MutationObserver(relabel).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        onScroll(() => {
            const focus = window.innerHeight * 0.4;
            let active = 0;
            entries.forEach((e, i) => { if (e.el.getBoundingClientRect().top <= focus) active = i; });
            buttons.forEach((b, i) => b.classList.toggle('is-active', i === active));
        });
    }

    /* ---------- 6. header parallax + wandering background icons ---------- */
    function setupParallax() {
        if (reduceMotion) return;
        const header = document.querySelector('.header');
        onScroll((y) => { if (header) header.style.setProperty('--sy', clamp(y, 0, 700)); });
        setupFloaters();
    }

    // Each background icon roams the viewport with a slowly turning heading,
    // bounces softly off the edges, and still drifts with scroll (parallax).
    function setupFloaters() {
        const floaters = [...document.querySelectorAll('.floating-element')];
        if (floaters.length === 0) return;
        const rand = (lo, hi) => lo + Math.random() * (hi - lo);
        const state = floaters.map((el, i) => {
            const r = el.getBoundingClientRect();
            return {
                el, x: 0, y: 0, ox: r.left, oy: r.top, w: r.width, h: r.height,
                speed: rand(14, 30),                 // px per second
                heading: rand(0, Math.PI * 2),
                turn: rand(0.15, 0.4) * (Math.random() < 0.5 ? -1 : 1),
                phase: rand(0, 100),
                parallax: 0.05 + (i % 4) * 0.04,
            };
        });
        let scrollY = window.scrollY;
        onScroll((y) => { scrollY = y; });

        let last = performance.now();
        const step = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const vw = window.innerWidth, vh = window.innerHeight, margin = 24;
            for (const s of state) {
                s.heading += Math.sin(now / 1000 * s.turn + s.phase) * dt * 0.9;
                s.x += Math.cos(s.heading) * s.speed * dt;
                s.y += Math.sin(s.heading) * s.speed * dt;
                const left = s.ox + s.x, top = s.oy + s.y;
                if (left < margin) { s.x = margin - s.ox; s.heading = Math.PI - s.heading; }
                if (left + s.w > vw - margin) { s.x = vw - margin - s.w - s.ox; s.heading = Math.PI - s.heading; }
                if (top < margin) { s.y = margin - s.oy; s.heading = -s.heading; }
                if (top + s.h > vh - margin) { s.y = vh - margin - s.h - s.oy; s.heading = -s.heading; }
                s.el.style.translate = `${s.x.toFixed(1)}px ${(s.y - scrollY * s.parallax).toFixed(1)}px`;
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /* ---------- 8. floating identity pill ---------- */
    function setupIdentityPill() {
        const pill = document.querySelector('.glass-identity');
        const header = document.querySelector('.header');
        if (!pill || !header) return;
        const toTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        pill.addEventListener('click', toTop);
        pill.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toTop(); } });
        onScroll(() => {
            pill.classList.toggle('is-shown', header.getBoundingClientRect().bottom < 40);
        });
    }

    /* ---------- 7. cursor spotlight on cards ---------- */
    function setupSpotlight() {
        if (window.matchMedia('(hover: none)').matches) return;
        const cards = document.querySelectorAll('.about-item, .experience-item, .education-item, .skill-category');
        cards.forEach((card) => {
            const glow = document.createElement('div');
            glow.className = 'card-spotlight';
            card.appendChild(glow);
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                card.style.setProperty('--my', `${e.clientY - r.top}px`);
            });
        });
    }
})();
