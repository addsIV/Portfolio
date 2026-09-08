// Liquid-glass surfaces (vanilla port of the Vue Bits / React Bits GlassSurface idea).
// An SVG filter displaces the backdrop per colour channel using a generated gradient
// map, giving edge refraction + chromatic fringing. Browsers without SVG
// backdrop-filter support (Safari, Firefox) fall back to a frosted blur.
(function () {
    'use strict';

    const DEFAULTS = {
        borderWidth: 0.07,      // edge band, fraction of the shorter side
        brightness: 60,         // inner plate lightness (%)
        opacity: 0.93,          // inner plate alpha
        blur: 11,               // inner plate blur (px) → how far refraction reaches inward
        displace: 0.6,          // final blur on the refracted result
        distortionScale: -140,  // displacement strength
        redOffset: 0,
        greenOffset: 10,
        blueOffset: 20,
        xChannel: 'R',
        yChannel: 'G',
        mixBlendMode: 'difference',
        saturation: 1.4,
        backgroundOpacity: 0.1,
    };

    let uid = 0;
    const NS = 'http://www.w3.org/2000/svg';

    const supportsSvgBackdrop = (() => {
        const ua = navigator.userAgent;
        const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS/.test(ua);
        const isFirefox = /Firefox/.test(ua);
        if (isSafari || isFirefox) return false;
        return CSS.supports('backdrop-filter', 'url(#x)') || CSS.supports('-webkit-backdrop-filter', 'url(#x)');
    })();
    const supportsBackdrop = CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

    function el(name, attrs) {
        const n = document.createElementNS(NS, name);
        for (const k in attrs) n.setAttribute(k, attrs[k]);
        return n;
    }

    function displacementMap(w, h, radius, o) {
        const edge = Math.min(w, h) * (o.borderWidth * 0.5);
        const id = `g${uid}`;
        const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="${NS}">
<defs>
<linearGradient id="${id}r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>
<linearGradient id="${id}b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="black"/>
<rect width="${w}" height="${h}" rx="${radius}" fill="url(#${id}r)"/>
<rect width="${w}" height="${h}" rx="${radius}" fill="url(#${id}b)" style="mix-blend-mode:${o.mixBlendMode}"/>
<rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${radius}" fill="hsl(0 0% ${o.brightness}% / ${o.opacity})" style="filter:blur(${o.blur}px)"/>
</svg>`;
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    function apply(target, opts) {
        const o = Object.assign({}, DEFAULTS, opts || {});
        target.classList.add('glass-surface');
        if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
        target.style.setProperty('--glass-bg', o.backgroundOpacity);

        if (!supportsSvgBackdrop) {
            target.classList.add(supportsBackdrop ? 'glass-surface--blur' : 'glass-surface--flat');
            return;
        }

        const id = `glass-${++uid}`;
        const svg = el('svg', { class: 'glass-surface-svg', 'aria-hidden': 'true' });
        const defs = el('defs', {});
        const filter = el('filter', { id, 'color-interpolation-filters': 'sRGB', x: '0%', y: '0%', width: '100%', height: '100%' });
        const feImage = el('feImage', { x: 0, y: 0, width: '100%', height: '100%', preserveAspectRatio: 'none', result: 'map' });
        filter.appendChild(feImage);

        const channels = [
            ['red', o.redOffset, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
            ['green', o.greenOffset, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
            ['blue', o.blueOffset, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'],
        ];
        for (const [name, offset, matrix] of channels) {
            filter.appendChild(el('feDisplacementMap', {
                in: 'SourceGraphic', in2: 'map', scale: o.distortionScale + offset,
                xChannelSelector: o.xChannel, yChannelSelector: o.yChannel, result: `disp-${name}`,
            }));
            filter.appendChild(el('feColorMatrix', { in: `disp-${name}`, type: 'matrix', values: matrix, result: name }));
        }
        filter.appendChild(el('feBlend', { in: 'red', in2: 'green', mode: 'screen', result: 'rg' }));
        filter.appendChild(el('feBlend', { in: 'rg', in2: 'blue', mode: 'screen', result: 'rgb' }));
        filter.appendChild(el('feGaussianBlur', { in: 'rgb', stdDeviation: o.displace }));
        defs.appendChild(filter);
        svg.appendChild(defs);
        target.insertBefore(svg, target.firstChild);

        const update = () => {
            const r = target.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
            feImage.setAttribute('href', displacementMap(Math.round(r.width), Math.round(r.height), Math.min(radius, r.height / 2), o));
        };
        update();
        target.style.setProperty('--glass-filter', `url(#${id}) saturate(${o.saturation})`);
        target.classList.add('glass-surface--svg');
        if ('ResizeObserver' in window) new ResizeObserver(() => setTimeout(update, 0)).observe(target);
    }

    function autoApply() {
        document.querySelectorAll('[data-glass]').forEach((node) => {
            let opts = {};
            const raw = node.getAttribute('data-glass');
            if (raw) { try { opts = JSON.parse(raw); } catch (_) { /* ignore bad JSON */ } }
            apply(node, opts);
        });
    }

    window.GlassSurface = { apply, supportsSvgBackdrop };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoApply);
    else autoApply();
})();
