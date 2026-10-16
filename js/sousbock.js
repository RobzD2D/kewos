/* =====================================================================
   KEWOS — comportements propres à la page sous-bock
   1. Horoscope du jour  2. Barre de réservation
   ===================================================================== */
(function () {
  'use strict';

  var motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Horoscope du jour ---------- */
  // À chaque scan, un horoscope tiré au sort parmi ceux de la page, mais jamais
  // celui de la fois précédente : le dernier tiré est mémorisé dans le navigateur.
  var horo = document.getElementById('horoscope');

  if (horo && typeof horo.showModal === 'function') {
    var KEY = 'kewos-horoscope-precedent';
    var readings = horo.querySelectorAll('[data-horoscope]');

    var last = -1;
    try { last = parseInt(window.localStorage.getItem(KEY), 10); } catch (e) {}

    var choices = [];
    for (var i = 0; i < readings.length; i++) {
      if (i !== last) choices.push(i);
    }
    var pick = choices[Math.floor(Math.random() * choices.length)];
    readings[pick].hidden = false;
    try { window.localStorage.setItem(KEY, String(pick)); } catch (e) {}

    var dateEl = document.getElementById('horoDate');
    if (dateEl) {
      dateEl.textContent = 'Horoscope du ' + new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
    }

    // La carte se retourne : demi-tour, on change de face, puis retour.
    var card = document.getElementById('horoCard');
    var back = horo.querySelector('.horo-back');
    var front = horo.querySelector('.horo-front');

    var showFront = function () {
      back.hidden = true;
      front.hidden = false;
      front.querySelector('.horo-title').focus();
    };

    document.getElementById('horoReveal').addEventListener('click', function () {
      if (motionOff) { showFront(); return; }
      card.classList.add('is-turning');
      window.setTimeout(function () {
        showFront();
        card.classList.remove('is-turning');
      }, 280);
    });

    horo.querySelectorAll('[data-horo-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { horo.close(); });
    });
    // Un clic sur le fond assombri ferme aussi
    horo.addEventListener('click', function (e) {
      if (e.target === horo) horo.close();
    });

    var openBtn = document.getElementById('horoOpen');
    if (openBtn) {
      openBtn.hidden = false;
      openBtn.addEventListener('click', function () { horo.showModal(); });
    }

    // Laisse l'affiche apparaître avant d'ouvrir la carte
    window.setTimeout(function () {
      if (!horo.open) horo.showModal();
    }, motionOff ? 0 : 700);
  }

  /* ---------- 2. Barre de réservation ---------- */
  // Elle apparaît une fois les boutons du hero sortis de l'écran, et
  // s'efface dès que la convocation, le dernier appel ou le pied de page
  // est visible, pour ne jamais doubler un bouton déjà à l'écran.
  var bar = document.getElementById('sbBar');

  if (bar && 'IntersectionObserver' in window) {
    var watched = Array.prototype.slice.call(
      document.querySelectorAll('#sbHeroActions, .convoc, #reserver, .site-footer')
    );
    var inView = watched.map(function () { return true; });

    var update = function () {
      var on = inView.indexOf(true) === -1;
      bar.classList.toggle('is-on', on);
      bar.inert = !on;
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView[watched.indexOf(entry.target)] = entry.isIntersecting;
      });
      update();
    });

    watched.forEach(function (el) { observer.observe(el); });
  }
})();
