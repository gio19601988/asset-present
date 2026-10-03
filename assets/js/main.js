/* AssetFlow Studio — marketing site interactions (language-agnostic) */
(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.remove('no-js');
    root.classList.add('js');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========== NAV ==========
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');

    function onScroll() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    // ========== MODULE TABS ==========
    var tablist = document.querySelector('[role="tablist"]');
    if (tablist) {
        var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
        var selectTab = function (tab, focus) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
            if (focus) tab.focus();
        };
        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { selectTab(tab); });
            tab.addEventListener('keydown', function (e) {
                var next = null;
                if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
                if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
                if (e.key === 'Home') next = tabs[0];
                if (e.key === 'End') next = tabs[tabs.length - 1];
                if (next) { e.preventDefault(); selectTab(next, true); }
            });
        });
        selectTab(tabs[0]);
    }

    // ========== GALLERY FILTERS ==========
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filters .tab'));
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var f = btn.getAttribute('data-filter');
            filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
            shots.forEach(function (s) {
                s.hidden = !(f === 'all' || s.getAttribute('data-category') === f);
            });
        });
    });

    // ========== LIGHTBOX ==========
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbTitle = document.getElementById('lbTitle');
    var lbDesc = document.getElementById('lbDesc');
    var list = [];
    var idx = 0;

    function itemFrom(el) {
        return { src: el.getAttribute('data-full'), title: el.getAttribute('data-title') || '', desc: el.getAttribute('data-desc') || '' };
    }

    function show(i) {
        idx = (i + list.length) % list.length;
        var it = list[idx];
        lbImg.src = it.src;
        lbImg.alt = it.title;
        lbTitle.textContent = it.title;
        lbDesc.textContent = it.desc;
        var multi = list.length > 1;
        lb.querySelector('.lb-prev').hidden = !multi;
        lb.querySelector('.lb-next').hidden = !multi;
    }

    function open(items, i) {
        if (!lb || typeof lb.showModal !== 'function') {
            window.open(items[i].src, '_blank', 'noopener');
            return;
        }
        list = items;
        show(i);
        lb.showModal();
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-full]');
        if (!trigger) return;
        e.preventDefault();
        var shot = trigger.closest('.shot');
        if (shot) {
            var visible = shots.filter(function (s) { return !s.hidden; });
            var items = visible.map(function (s) { return itemFrom(s.querySelector('[data-full]')); });
            open(items, visible.indexOf(shot));
        } else {
            open([itemFrom(trigger)], 0);
        }
    });

    if (lb) {
        lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
        lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
        lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
        lb.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') show(idx - 1);
            if (e.key === 'ArrowRight') show(idx + 1);
        });
        lb.addEventListener('close', function () { lbImg.removeAttribute('src'); });
    }

    // ========== REVEAL ON SCROLL ==========
    var reveals = document.querySelectorAll('.reveal');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('visible');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    // ========== DEMO FORM (Netlify Forms, AJAX with no-JS fallback) ==========
    var form = document.getElementById('demoForm');
    if (form) {
        var status = document.getElementById('formStatus');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            status.className = 'form-status';
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(form)).toString()
            }).then(function (res) {
                if (!res.ok) throw new Error(res.status);
                form.reset();
                status.textContent = form.getAttribute('data-ok');
                status.className = 'form-status ok';
            }).catch(function () {
                status.textContent = form.getAttribute('data-err');
                status.className = 'form-status err';
            }).then(function () {
                btn.disabled = false;
                status.focus();
            });
        });
    }

    // ========== FOOTER YEAR ==========
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();
