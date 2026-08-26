// ============ INTRO OVERLAY CLEANUP ============
(() => {
    const overlay = document.getElementById('introOverlay');
    if (!overlay) {
        document.body.classList.remove('is-loading');
        return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 0 : 10935;
    setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('is-loading');
    }, delay);
})();

// ============ YEAR ============
(() => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ============ CHECKOUT CTA (Meta Pixel InitiateCheckout) ============
(() => {
    const btns = document.querySelectorAll('.js-checkout-cta');
    if (!btns.length) return;
    btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (typeof fbq === 'function') {
                try {
                    fbq('track', 'InitiateCheckout', {
                        content_name: 'De LeOn',
                        content_category: 'Lowticket',
                        value: 57.00,
                        currency: 'BRL',
                    });
                } catch (_) { /* pixel unavailable */ }
            }
        });
    });
})();

// ============ TABLETS SHOWCASE REVEAL ============
(() => {
    const stage = document.getElementById('tabletsStage');
    const section = document.querySelector('.method-showcase');
    if (!stage || !section) return;

    // Hero anima ~2700ms depois do body perder 'is-loading' (intro overlay
    // sai aos 10.9s no normal, 0ms em prefers-reduced-motion). No celular
    // a seção 2 fica em viewport já no load — IO dispararia cedo. Flag
    // global 'heroDone' garante que o reveal só acontece depois do hero,
    // mas se o user rola tarde (hero já animou) revela imediato.
    const HERO_ANIM_DURATION_MS = 2700;

    let heroDone = false;
    const heroDoneListeners = [];

    const markHeroDone = () => {
        heroDone = true;
        heroDoneListeners.forEach(fn => fn());
        heroDoneListeners.length = 0;
    };

    if (!document.body.classList.contains('is-loading')) {
        setTimeout(markHeroDone, HERO_ANIM_DURATION_MS);
    } else {
        const mo = new MutationObserver(() => {
            if (!document.body.classList.contains('is-loading')) {
                mo.disconnect();
                setTimeout(markHeroDone, HERO_ANIM_DURATION_MS);
            }
        });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    const reveal = () => {
        stage.classList.add('is-on');
        section.classList.add('is-revealed');
    };

    const revealWhenHeroDone = () => {
        if (heroDone) reveal();
        else heroDoneListeners.push(reveal);
    };

    if (!('IntersectionObserver' in window)) {
        revealWhenHeroDone();
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                revealWhenHeroDone();
                io.disconnect();
            }
        });
    }, { threshold: 0.2 });
    io.observe(section);
})();

// ============ FLOW BUILDER — dynamic SVG cables + reveal ============
(() => {
    const flow = document.getElementById('flowDiagram');
    const svg = document.getElementById('flowSvg');
    if (!flow || !svg) return;
    const nodes = flow.querySelectorAll('.flow-node');
    if (!nodes.length) return;

    const SVGNS = 'http://www.w3.org/2000/svg';
    const XLINK = 'http://www.w3.org/1999/xlink';

    // connection edges per node, in DOM order (1..6)
    const conns = [
        { from: 0, to: 1, fromEdge: 'r', toEdge: 'l' },
        { from: 1, to: 2, fromEdge: 'r', toEdge: 'l' },
        { from: 2, to: 3, fromEdge: 'b', toEdge: 't' },
        { from: 3, to: 4, fromEdge: 'l', toEdge: 'r' },
        { from: 4, to: 5, fromEdge: 'l', toEdge: 'r' },
    ];

    const portOf = (node, edge, frameRect) => {
        const r = node.getBoundingClientRect();
        const x = r.left - frameRect.left;
        const y = r.top - frameRect.top;
        switch (edge) {
            case 'r': return { x: x + r.width, y: y + r.height / 2, dir: 'r' };
            case 'l': return { x: x,            y: y + r.height / 2, dir: 'l' };
            case 't': return { x: x + r.width / 2, y: y,            dir: 't' };
            case 'b': return { x: x + r.width / 2, y: y + r.height, dir: 'b' };
        }
    };

    const cubic = (from, to) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const horiz = (from.dir === 'r' || from.dir === 'l');
        const span = horiz ? Math.abs(dx) : Math.abs(dy);
        const off = Math.max(40, span * 0.55);
        let c1x, c1y, c2x, c2y;
        if (horiz) {
            c1x = from.x + (from.dir === 'r' ? off : -off); c1y = from.y;
            c2x = to.x   + (to.dir   === 'r' ? off : -off); c2y = to.y;
        } else {
            c1x = from.x; c1y = from.y + (from.dir === 'b' ? off : -off);
            c2x = to.x;   c2y = to.y   + (to.dir   === 'b' ? off : -off);
        }
        return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    };

    const build = () => {
        const rect = flow.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        svg.setAttribute('width', rect.width);
        svg.setAttribute('height', rect.height);
        svg.innerHTML = '';

        conns.forEach((c, i) => {
            const from = portOf(nodes[c.from], c.fromEdge, rect);
            const to   = portOf(nodes[c.to],   c.toEdge,   rect);
            if (!from || !to) return;

            const d = cubic(from, to);
            const id = `cable-${i}`;

            const path = document.createElementNS(SVGNS, 'path');
            path.setAttribute('id', id);
            path.setAttribute('d', d);
            path.setAttribute('class', 'flow-cable');
            svg.appendChild(path);

            const dot = document.createElementNS(SVGNS, 'circle');
            dot.setAttribute('r', '4');
            dot.setAttribute('class', 'flow-packet');

            const motion = document.createElementNS(SVGNS, 'animateMotion');
            motion.setAttribute('dur', '2.6s');
            motion.setAttribute('repeatCount', 'indefinite');
            motion.setAttribute('begin', `${i * 0.45}s`);
            motion.setAttribute('rotate', 'auto');

            const mp = document.createElementNS(SVGNS, 'mpath');
            mp.setAttributeNS(XLINK, 'xlink:href', `#${id}`);
            mp.setAttribute('href', `#${id}`);
            motion.appendChild(mp);

            dot.appendChild(motion);
            svg.appendChild(dot);
        });
    };

    let rafId;
    const rebuild = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(build);
    };

    const reveal = () => {
        nodes.forEach(n => n.classList.add('is-on'));
        build();
        // small delay so cables fade in after nodes start appearing
        setTimeout(() => flow.classList.add('is-live'), 600);
    };

    if (!('IntersectionObserver' in window)) {
        reveal();
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    reveal();
                    io.disconnect();
                }
            });
        }, { threshold: 0.15 });
        io.observe(flow);
    }

    window.addEventListener('resize', rebuild, { passive: true });
})();

// ============ REVEAL ON SCROLL ============
const revealTargets = document.querySelectorAll('.card, .who-list li, .faq-item, .section-header, .final-cta-card');
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => io.observe(el));
} else {
    revealTargets.forEach(el => el.classList.add('visible'));
}

// ============ FILE ICON COLOR BY EXTENSION ============
(() => {
    const tree = document.getElementById('folderTree');
    if (!tree) return;
    tree.querySelectorAll('.tree-icon-file').forEach(icon => {
        const leaf = icon.nextElementSibling;
        if (!leaf) return;
        const name = (leaf.textContent || '').trim();
        const dot = name.lastIndexOf('.');
        if (dot <= 0) return;
        const ext = name.slice(dot + 1).replace(/\W.*/, '').toLowerCase();
        if (ext) icon.classList.add(`ext-${ext}`);
    });
})();

// ============ FOLDER TREE — SMOOTH OPEN/CLOSE + PROMPT TYPING ============
(() => {
    const tree = document.getElementById('folderTree');
    if (!tree) return;

    const items = tree.querySelectorAll('.tree-list > .tree-item');
    if (!items.length) return;

    const promptCmd = document.querySelector('.prompt-cmd');

    // Commands matched to each folder (same order as items)
    const PROMPTS = [
        'DE LEON load _contexto/',
        'DE LEON sync clientes/nike',
        'DE LEON build marca/ --tokens',
        'DE LEON generate carrossel',
        'DE LEON deploy ads --google',
        'DE LEON export proposta',
        'DE LEON invoke skills/carrossel'
    ];

    const defaultIdx = Math.max(0, [...items].findIndex(it => it.dataset.default === 'open'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- height-based open/close (fluid)
    const openFolder = (item) => {
        const children = item.querySelector(':scope > .tree-children');
        if (!children) return;
        item.classList.add('is-open');
        const target = children.scrollHeight;
        children.style.height = target + 'px';
        const onEnd = (e) => {
            if (e.target !== children || e.propertyName !== 'height') return;
            children.style.height = 'auto';
            children.removeEventListener('transitionend', onEnd);
        };
        children.addEventListener('transitionend', onEnd);
    };

    const closeFolder = (item) => {
        const children = item.querySelector(':scope > .tree-children');
        if (!children) return;
        const current = children.scrollHeight;
        children.style.height = current + 'px';
        // force reflow before transitioning back to 0
        children.offsetHeight; // eslint-disable-line no-unused-expressions
        item.classList.remove('is-open');
        children.style.height = '0px';
    };

    // ---- prompt typing
    const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);

    const colorizePrompt = (text) => {
        let remainder = text;
        let prefix = '';
        if (remainder.startsWith('DE LEON')) {
            prefix = '<span class="brand-badge-inline">DE LEON</span>';
            remainder = remainder.slice(7);
        }
        const tokens = remainder.split(/(\s+)/);
        const rest = tokens.map(tok => {
            if (!tok) return '';
            if (/^\s+$/.test(tok)) return tok;
            if (tok.startsWith('-')) {
                return `<span class="prompt-flag">${escapeHtml(tok)}</span>`;
            }
            if (tok.includes('/')) {
                return `<span class="prompt-path">${escapeHtml(tok)}</span>`;
            }
            return `<span class="prompt-arg">${escapeHtml(tok)}</span>`;
        }).join('');
        return prefix + rest;
    };

    let typeTimer;
    const typePrompt = (text) => {
        if (!promptCmd) return;
        if (typeTimer) clearTimeout(typeTimer);
        let i = 0;
        const tick = () => {
            if (i > text.length) return;
            promptCmd.innerHTML = colorizePrompt(text.slice(0, i));
            i++;
            if (i <= text.length) {
                typeTimer = setTimeout(tick, 28 + Math.random() * 32);
            }
        };
        tick();
    };

    // ---- early-out for reduced motion
    if (prefersReduced) {
        items.forEach(it => it.classList.add('is-shown'));
        const item = items[defaultIdx];
        item.classList.add('is-open');
        const ch = item.querySelector(':scope > .tree-children');
        if (ch) ch.style.height = 'auto';
        if (promptCmd) promptCmd.innerHTML = colorizePrompt(PROMPTS[defaultIdx] || '');
        return;
    }

    let current = defaultIdx;
    let cycleTimer;

    const start = () => {
        items.forEach((item, i) => {
            setTimeout(() => item.classList.add('is-shown'), 220 + i * 110);
        });

        const revealEnd = 220 + items.length * 110 + 250;

        setTimeout(() => {
            openFolder(items[defaultIdx]);
            setTimeout(() => typePrompt(PROMPTS[defaultIdx] || ''), 220);
        }, revealEnd);

        const cycle = () => {
            closeFolder(items[current]);
            current = (current + 1) % items.length;
            setTimeout(() => {
                openFolder(items[current]);
                setTimeout(() => typePrompt(PROMPTS[current] || ''), 200);
            }, 320);
            cycleTimer = setTimeout(cycle, 3600);
        };

        cycleTimer = setTimeout(cycle, revealEnd + 3600);
    };

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    start();
                    io.disconnect();
                }
            });
        }, { threshold: 0.2 });
        io.observe(tree);
    } else {
        start();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (cycleTimer) clearTimeout(cycleTimer);
            if (typeTimer) clearTimeout(typeTimer);
        }
    });
})();

// ============ SMOOTH SCROLL OFFSET FIX ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============ TABLETS SHOWCASE: 6 TECNOLOGIAS DE IA ============
(() => {
    const stage = document.getElementById('tabletsStage');
    if (!stage) return;

    const tablets = Array.from(stage.querySelectorAll('.tablet'));
    const tabBtns = Array.from(document.querySelectorAll('.tech-tab-btn'));
    const dots = Array.from(document.querySelectorAll('.tablet-dot'));
    const prevBtn = document.getElementById('tabletPrevBtn');
    const nextBtn = document.getElementById('tabletNextBtn');

    if (!tablets.length) return;

    let currentIndex = 0;
    const total = tablets.length;
    let autoPlayTimer = null;
    let pauseUntil = 0;

    const updateClasses = (index) => {
        currentIndex = (index + total) % total;
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;

        tablets.forEach((t, i) => {
            t.classList.remove('is-active', 'is-prev', 'is-next');
            if (i === currentIndex) {
                t.classList.add('is-active');
            } else if (i === prevIndex) {
                t.classList.add('is-prev');
            } else if (i === nextIndex) {
                t.classList.add('is-next');
            }
        });

        tabBtns.forEach((btn, i) => {
            const active = i === currentIndex;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
            if (active && window.innerWidth <= 900) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });

        // Mobile scroll sync
        if (window.innerWidth <= 900) {
            const activeTablet = tablets[currentIndex];
            if (activeTablet) {
                const targetLeft = activeTablet.offsetLeft - (stage.clientWidth - activeTablet.clientWidth) / 2;
                stage.scrollTo({ left: targetLeft, behavior: 'smooth' });
            }
        }
    };

    const goToSlide = (idx) => {
        pauseUntil = Date.now() + 7000;
        updateClasses(idx);
    };

    // Tabs click
    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            if (!isNaN(idx)) goToSlide(idx);
        });
    });

    // Dots click
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index, 10);
            if (!isNaN(idx)) goToSlide(idx);
        });
    });

    // Arrows
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Clicking prev/next tablet on desktop
    tablets.forEach((t, i) => {
        t.addEventListener('click', () => {
            if (t.classList.contains('is-prev') || t.classList.contains('is-next')) {
                goToSlide(i);
            }
        });
    });

    // Mobile scroll detection
    let scrollTimeout;
    stage.addEventListener('scroll', () => {
        if (window.innerWidth > 900) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const center = stage.scrollLeft + stage.clientWidth / 2;
            let closestIdx = 0;
            let closestDist = Infinity;
            tablets.forEach((t, i) => {
                const tCenter = t.offsetLeft + t.clientWidth / 2;
                const dist = Math.abs(tCenter - center);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            });
            if (closestIdx !== currentIndex) {
                currentIndex = closestIdx;
                tabBtns.forEach((btn, i) => btn.classList.toggle('is-active', i === currentIndex));
                dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
            }
        }, 80);
    }, { passive: true });

    // Interaction pause
    ['pointerdown', 'touchstart', 'mouseenter'].forEach((ev) => {
        stage.addEventListener(ev, () => { pauseUntil = Date.now() + 8000; }, { passive: true });
    });

    // Autoplay
    autoPlayTimer = setInterval(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (Date.now() < pauseUntil) return;
        updateClasses(currentIndex + 1);
    }, 4800);

    // Initial setup
    updateClasses(0);
})();

// ============ PROVAS: ver mais resultados ============
(() => {
    const btn = document.getElementById('verMaisProvas');
    const more = document.getElementById('provasMais');
    if (!btn || !more) return;
    btn.addEventListener('click', () => {
        more.hidden = false;
        btn.remove();
    });
})();
