/* =====================================================================
   KEWOS — comportements du site
   0. Écran de choix (versus)  1. Images  2. Hero  3. En-tête
   4. Verre liquide  5. Menu mobile  6. Apparitions au scroll
   7. Lien actif  8. Vidéos  9. Formulaires  10. Année  11. Dates passées
   ===================================================================== */
(function () {
  'use strict';

  var motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Écran de choix : Stand-up vs Acting ---------- */
  var versus = document.getElementById('versusGate');
  if (versus) {
    var htmlEl = document.documentElement;
    htmlEl.classList.add('versus-locked');

    var lockedEls = [
      document.getElementById('siteHeader'),
      document.getElementById('contenu'),
      document.querySelector('.site-footer')
    ];
    lockedEls.forEach(function (el) { if (el) el.inert = true; });

    // Sur certains OS/navigateurs, le clic qui redonne le focus à une fenêtre
    // ou un onglet en arrière-plan est aussi transmis à la page. Sans ce garde-fou,
    // ce clic « d'activation » pourrait tomber sur un choix et fermer l'écran
    // avant même que l'utilisateur ait pu regarder ou survoler quoi que ce soit.
    var lastWindowFocusAt = 0;
    window.addEventListener('focus', function () { lastWindowFocusAt = Date.now(); });
    var isActivatingClick = function () { return Date.now() - lastWindowFocusAt < 400; };

    var leaveVersus = function (targetSelector) {
      versus.classList.add('is-leaving');
      htmlEl.classList.remove('versus-locked');
      lockedEls.forEach(function (el) { if (el) el.inert = false; });

      var target = targetSelector && document.querySelector(targetSelector);
      if (target) {
        requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth', block: 'start' });
        });
      }
      window.setTimeout(function () { versus.hidden = true; }, motionOff ? 0 : 650);
    };

    versus.querySelectorAll('.versus-choice').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (isActivatingClick()) { e.preventDefault(); return; }
        leaveVersus(btn.getAttribute('data-target'));
      });
    });

    var versusSkip = document.getElementById('versusSkip');
    if (versusSkip) versusSkip.addEventListener('click', function (e) {
      if (isActivatingClick()) { e.preventDefault(); return; }
      leaveVersus('#accueil');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !versus.hidden) leaveVersus('#accueil');
    });

    var firstChoice = versus.querySelector('.versus-choice');
    if (firstChoice) firstChoice.focus();
  }

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

  // Machine à écrire : une fois la ligne tapée, on retire le masque. Safari (iPhone)
  // s'arrête parfois sur l'avant-dernière étape et laissait la dernière lettre
  // à moitié cachée (« 30 JANVIEI »).
  document.querySelectorAll('.type-line').forEach(function (line) {
    line.addEventListener('animationend', function (e) {
      if (e.target !== line || e.pseudoElement) return; // ignore le curseur (::after)
      line.style.animation = 'none';
      line.style.clipPath = 'none';
    });
  });

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

  // Tout élément portant data-yt ouvre le lecteur (vignettes, bouton bande démo…).
  if (lightbox) document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      if (!id) return;
      var ratio = btn.getAttribute('data-ratio') || '16/9';
      frame.style.aspectRatio = ratio;
      lightbox.classList.toggle('is-vertical', ratio === '9/16');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = btn.getAttribute('data-title') || 'Vidéo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(iframe);
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (lightbox) {
    lightbox.addEventListener('close', function () { frame.innerHTML = ''; });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeVideo(); });
  }

  /* ---------- 9. Formulaires : envoi par e-mail ---------- */
  // Les formulaires marqués data-send partent vers le.kewos@gmail.com via FormSubmit.
  // Au tout premier envoi, FormSubmit écrit à cette adresse pour faire activer
  // le formulaire (bouton « Activate Form ») : rien n'est transmis avant ce clic.
  // Sans JavaScript, l'attribut action du formulaire prend le relais.
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/le.kewos@gmail.com';

  document.querySelectorAll('form[data-send]').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var submit = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (data._honey) return; // champ piège rempli : un robot

      submit.disabled = true;
      msg.classList.remove('is-error');
      msg.textContent = 'Envoi en cours…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (String(res.success) !== 'true') throw new Error(res.message || 'Échec');
          msg.textContent = form.getAttribute('data-success') || 'Message envoyé, merci !';
          form.reset();
        })
        .catch(function () {
          msg.classList.add('is-error');
          msg.innerHTML = 'L\'envoi n\'a pas abouti. Écrivez directement à ' +
            '<a href="mailto:le.kewos@gmail.com">le.kewos@gmail.com</a>.';
        })
        .then(function () { submit.disabled = false; });
    });
  });

  /* ---------- 10. Année du copyright ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 11. Dates passées : retirées le lendemain ---------- */
  // Filet de sécurité si la liste n'a pas été mise à jour à la main.
  // Le bandeau « Prochaine date » du hero suit la première date non complète.
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  document.querySelectorAll('.date-list').forEach(function (list) {
    list.querySelectorAll('.date-row').forEach(function (row) {
      var time = row.querySelector('time[datetime]');
      var day = time && new Date(time.getAttribute('datetime').slice(0, 10) + 'T00:00:00');
      if (day && day < today) row.parentNode.removeChild(row);
    });

    if (!list.querySelector('.date-row')) {
      var empty = document.createElement('li');
      empty.className = 'date-empty';
      empty.innerHTML = 'Nouvelles dates très bientôt. Les annonces tombent d\'abord sur ' +
        '<a href="https://www.instagram.com/le_kewos/" target="_blank" rel="noopener">Instagram</a>.';
      list.appendChild(empty);
    }
  });

  var heroNext = document.querySelector('.hero-next');
  var firstList = document.querySelector('#dates .date-list');
  if (heroNext && firstList) {
    var next = null;
    firstList.querySelectorAll('.date-row').forEach(function (row) {
      if (!next && !row.querySelector('.stamp')) next = row;
    });

    if (!next) {
      heroNext.style.display = 'none';
    } else {
      var iso = next.querySelector('time').getAttribute('datetime');
      var city = next.querySelector('.date-where strong').textContent;
      var dept = (next.querySelector('.date-where em').textContent.match(/\(\d+\)/) || [''])[0];
      heroNext.querySelector('.hero-next-value').textContent =
        iso.slice(8, 10) + '.' + iso.slice(5, 7) + ' – ' + city + (dept ? ' ' + dept : '');
    }
  }
})();
