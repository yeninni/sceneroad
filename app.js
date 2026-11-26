/* SceneRoad 프로토타입 동작 */
(function () {
  'use strict';

  var SCREENS = [
    { id: 'home', label: '방문객 홈' },
    { id: 'partner', label: '씬로드 파트너' },
    { id: 'course', label: '도보 코스' },
    { id: 'spots', label: '로컬 스팟' }
  ];

  var lang = 'kr';
  var current = 'home';

  /* ---------- 언어 ---------- */
  function applyOne(el) {
    if (!el.dataset.ko) el.dataset.ko = el.textContent.trim();
    var next = lang === 'en' ? el.dataset.en : el.dataset.ko;
    if (next != null && el.textContent !== next) el.textContent = next;
  }
  function applyLangTo(root) {
    root.querySelectorAll('[data-en]').forEach(applyOne);
  }
  function setLang(next) {
    lang = next;
    document.documentElement.lang = next === 'en' ? 'en' : 'ko';
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.lang === next);
    });
    document.querySelectorAll('[data-en]').forEach(applyOne);
  }

  /* ---------- 폰 만들기 ---------- */
  function makePhone(screenId, opts) {
    opts = opts || {};
    var tpl = document.getElementById('tpl-' + screenId);
    var phone = document.createElement('div');
    phone.className = 'phone';
    phone.dataset.screen = screenId;
    phone.appendChild(tpl.content.cloneNode(true));

    var screen = phone.querySelector('.screen');
    var toast = document.createElement('div');
    toast.className = 'toast';
    screen.appendChild(toast);

    if (opts.static) {
      phone.classList.add('phone--static');
      var hover = document.createElement('span');
      hover.className = 'phone__hover';
      hover.textContent = '눌러서 크게 보기';
      phone.appendChild(hover);
      phone.setAttribute('role', 'button');
      phone.setAttribute('tabindex', '0');
      phone.setAttribute('aria-label', SCREENS.filter(function (s) { return s.id === screenId; })[0].label + ' 화면 크게 보기');
      phone.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        openMobile(screenId);
      });
      phone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMobile(screenId);
        }
      });
    }
    applyLangTo(phone);
    return phone;
  }

  /* ---------- 전체 한눈에 보기 ---------- */
  function buildOverview() {
    var wrap = document.getElementById('phones');
    SCREENS.forEach(function (s, i) {
      var item = document.createElement('div');
      item.className = 'phones__item';
      var label = document.createElement('div');
      label.className = 'phones__label';
      var num = document.createElement('b');
      num.textContent = '0' + (i + 1);
      label.appendChild(num);
      label.appendChild(document.createTextNode(s.label));
      item.appendChild(label);
      item.appendChild(makePhone(s.id, { static: true }));
      wrap.appendChild(item);
    });
  }

  /* ---------- 화면 전환 ---------- */
  function setView(view) {
    document.querySelectorAll('.viewswitch__btn').forEach(function (b) {
      var on = b.dataset.view === view;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.view').forEach(function (v) {
      var on = v.id === 'view-' + view;
      v.classList.toggle('is-active', on);
      v.hidden = !on;
    });
    if (view === 'mobile') renderStage();
  }

  function openMobile(screenId) {
    current = screenId;
    setView('mobile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStage() {
    var stage = document.getElementById('stagePhone');
    stage.innerHTML = '';
    stage.appendChild(makePhone(current));
    document.querySelectorAll('.rail__btn').forEach(function (b) {
      var on = b.dataset.screen === current;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function buildRail() {
    var rail = document.getElementById('rail');
    SCREENS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__btn';
      b.dataset.screen = s.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', s.id === current ? 'true' : 'false');
      var num = document.createElement('b');
      num.textContent = '0' + (i + 1);
      b.appendChild(num);
      b.appendChild(document.createTextNode(s.label));
      if (s.id === current) b.classList.add('is-active');
      b.addEventListener('click', function () {
        current = s.id;
        renderStage();
      });
      rail.appendChild(b);
    });
  }

  /* ---------- 화면 안 상호작용 ---------- */
  function toastIn(node, text) {
    var screen = node.closest('.screen');
    if (!screen) return;
    var t = screen.querySelector('.toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('is-on');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }

  function goScreen(id, fromBtn) {
    var phone = fromBtn.closest('.phone');
    if (!phone || phone.classList.contains('phone--static')) {
      openMobile(id);
      return;
    }
    if (phone.dataset.screen === id) return;
    var fresh = makePhone(id);
    phone.replaceWith(fresh);
    current = id;
    var rail = document.querySelectorAll('.rail__btn');
    rail.forEach(function (b) {
      var on = b.dataset.screen === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function applyFilter(chip) {
    var group = chip.closest('.chips');
    var screen = chip.closest('.screen');
    var cat = chip.dataset.cat;
    group.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('is-active', c === chip);
    });
    var kind = group.dataset.filter;
    var items = screen.querySelectorAll(kind === 'course' ? '.step' : '.spotcard');
    var visible = 0;
    items.forEach(function (it) {
      var show = cat === 'all' || it.dataset.cat === cat;
      it.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    var empty = screen.querySelector('.empty');
    if (empty) empty.hidden = visible > 0;
  }

  function toggleWalk(btn) {
    var on = btn.classList.toggle('is-on');
    var span = btn.querySelector('span');
    span.dataset.ko = on ? '동선 안내 중 1/3' : '도보 동선 시작하기';
    span.dataset.en = on ? 'Route running, stop 1 of 3' : 'Start the walk course';
    applyLangTo(btn.closest('.screen'));
    toastIn(btn, on
      ? (lang === 'en' ? 'Walk route started. Stop 1, Onmigwan Anguk, is 5 minutes away.' : '안국 도보 코스를 시작합니다. 1번 온미관 안국까지 도보 5분입니다.')
      : (lang === 'en' ? 'Route guidance stopped.' : '동선 안내를 멈췄습니다.'));
  }

  function toggleRegion(btn) {
    var menu = btn.parentNode.querySelector('.region__menu');
    var open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeRegion() {
    document.querySelectorAll('.region__menu').forEach(function (m) { m.hidden = true; });
    document.querySelectorAll('.region__btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.region')) closeRegion();

    var langBtn = e.target.closest('.lang__btn');
    if (langBtn) { setLang(langBtn.dataset.lang); return; }

    var chip = e.target.closest('.chip');
    if (chip) { applyFilter(chip); return; }

    var go = e.target.closest('[data-go]');
    if (go) { goScreen(go.dataset.go, go); return; }

    var open = e.target.closest('[data-open]');
    if (open) { openMobile(open.dataset.open); return; }

    var walk = e.target.closest('#startWalk');
    if (walk) { toggleWalk(walk); return; }

    var regionBtn = e.target.closest('.region__btn');
    if (regionBtn) {
      e.stopPropagation();
      toggleRegion(regionBtn);
      return;
    }

    var toastBtn = e.target.closest('[data-toast]');
    if (toastBtn) {
      toastIn(toastBtn, lang === 'en' ? 'This part is not connected in the prototype yet.' : toastBtn.dataset.toast);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeRegion();
  });

  document.querySelectorAll('.viewswitch__btn').forEach(function (b) {
    b.addEventListener('click', function () { setView(b.dataset.view); });
  });

  /* ---------- 시작 ---------- */
  buildOverview();
  buildRail();
  setLang('kr');
})();
