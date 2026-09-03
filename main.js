/* =====================================================================
   KEWOS — comportements du site
   1. Images  2. Hero  3. En-tête  4. Verre liquide  5. Menu mobile
   6. Apparitions au scroll  7. Lien actif  8. Vidéos  9. Formulaire
   ===================================================================== */
(function () {
  'use strict';

  var motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Images : on teste les extensions possibles ---------- */
  // Permet de déposer hero-section.jpg, .png ou .webp sans toucher au code.
  document.querySelectorAll('img[data-try]').forEach(function (img) {
    var sources = img.getAttribute('data-try').split(',').map(function (s) { return s.trim(); });
    var index = 0;

    function next() {
      index += 1;
      if (index < sources.length) {
        img.src = sources[index];
      } else {
        // Plus aucune piste : pixel transparent, le motif de secours prend le relais.
        img.removeEventListener('error', next);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        if (img.parentElement) img.parentElement.classList.add('is-missing');
      }
    }

    img.addEventListener('error', next);
    if (img.complete && img.naturalWidth === 0) next();
  });

  /* ---------- 2. Hero : entrée orchestrée une seule fois ---------- */
  var hero = document.querySelector('.hero');
  var heroImg = document.querySelector('.hero-media img');

  if (heroImg) {
    var showImg = function () { heroImg.classList.add('is-loaded'); };
    if (heroImg.complete && heroImg.naturalWidth > 0) showImg();
    else heroImg.addEventListener('load', showImg);
  }
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-ready'); });

  /* ---------- 3. En-tête : compacte dès qu'on quitte le hero ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 4. Verre liquide ---------- */
  // 4a. Reflet spéculaire qui suit le curseur sur toutes les surfaces vitrées.
  document.querySelectorAll('[data-glass]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      el.style.setProperty('--sheen', '1');
    });
    el.addEventListener('pointerleave', function () {
      el.style.setProperty('--sheen', '0');
    });
  });

  // 4b. La pastille de verre qui glisse d'un lien de menu à l'autre.
  var nav = document.getElementById('nav');
  if (nav) {
    var pill = nav.querySelector('.nav-pill');
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));

    var moveTo = function (link) {
      pill.style.width = link.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + link.offsetLeft + 'px) scaleX(1)';
      nav.classList.add('pill-on');
    };

    links.forEach(function (link) {
      link.addEventListener('pointerenter', function () { moveTo(link); });
      link.addEventListener('focus', function () { moveTo(link); });
    });

    var park = function () {
      var current = nav.querySelector('a.is-current');
      if (current) moveTo(current);
      else nav.classList.remove('pill-on');
    };
    nav.addEventListener('pointerleave', park);
    nav.addEventListener('focusout', function (e) {
      if (!nav.contains(e.relatedTarget)) park();
    });
    window.addEventListener('resize', park);
  }

  /* ---------- 5. Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menuMobile');

  if (burger && menu) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- 6. Apparitions au scroll ---------- */
  // Décalage en cascade pour les listes marquées data-stagger.
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  var revealables = document.querySelectorAll('[data-reveal]');

  if (motionOff || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 7. Lien actif dans le menu ---------- */
  var sections = document.querySelectorAll('main section[id]');
  if (nav && sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = nav.querySelector('a[href="#' + entry.target.id + '"]');
        nav.querySelectorAll('a').forEach(function (a) { a.classList.remove('is-current'); });
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 8. Vidéos : YouTube chargé seulement au clic ---------- */
  var lightbox = document.getElementById('lightbox');
  var frame = document.getElementById('lightboxFrame');
  var closeBtn = document.getElementById('lightboxClose');

  var closeVideo = function () {
    frame.innerHTML = '';
    if (lightbox.open) lightbox.close();
  };

  document.querySelectorAll('.video-play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      if (!id) return;
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" ' +
        'title="' + (btn.getAttribute('data-title') || 'Vidéo') + '" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" ' +
        'allowfullscreen></iframe>';
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (lightbox) {
    lightbox.addEventListener('close', function () { frame.innerHTML = ''; });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeVideo(); });
  }

  /* ---------- 9. Formulaire d'alerte ---------- */
  // Message local en attendant le branchement sur Brevo / Mailchimp.
  var form = document.querySelector('.alerte-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var msg = form.querySelector('.form-msg');
      if (!form.checkValidity()) return;
      e.preventDefault();
      msg.textContent = 'C\'est noté. Vous serez prévenu dès la prochaine annonce.';
      form.reset();
    });
  }

  /* ---------- 10. Année du copyright ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
