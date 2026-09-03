(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const progress = $('.scroll-progress');
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = distance > 0 ? Math.min(window.scrollY / distance, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const menuButton = $('.menu-toggle');
  const menuButtonLabel = $('.menu-toggle .sr-only');
  const nav = $('#primary-nav');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (menuButtonLabel) menuButtonLabel.textContent = 'Open menu';
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (menuButtonLabel) menuButtonLabel.textContent = open ? 'Close menu' : 'Open menu';
    document.body.classList.toggle('menu-open', open);
  });
  $$('#primary-nav a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth >= 820) closeMenu(); });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('has-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
    $$('.reveal').forEach(el => observer.observe(el));
  }

  $$('[data-carousel]').forEach(carousel => {
    const slides = $$('[data-slide]', carousel);
    const dots = $$('[data-carousel-dot]', carousel);
    const previous = $('[data-carousel-prev]', carousel);
    const next = $('[data-carousel-next]', carousel);
    const toggle = $('[data-carousel-toggle]', carousel);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = Number(carousel.dataset.interval || 6000);
    let current = 0;
    let timer = null;
    let paused = reduceMotion;
    let touchStart = null;

    const show = position => {
      current = (position + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, index) => {
        const active = index === current;
        dot.classList.toggle('active', active);
        if (active) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
      });
    };
    const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (!paused && slides.length > 1 && !document.hidden) timer = window.setInterval(() => show(current + 1), interval);
    };
    const step = direction => { show(current + direction); start(); };

    previous?.addEventListener('click', () => step(-1));
    next?.addEventListener('click', () => step(1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); start(); }));
    toggle?.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      start();
    });
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    carousel.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', event => {
      if (touchStart === null) return;
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) step(distance > 0 ? -1 : 1);
      touchStart = null;
    }, { passive: true });
    document.addEventListener('visibilitychange', start);
    if (paused && toggle) {
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Play slideshow');
      toggle.textContent = '▶';
    }
    show(0);
    start();
  });

  const journeySteps = $$('.journey-track li');
  if (journeySteps.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let journeyIndex = 0;
    window.setInterval(() => {
      journeySteps[journeyIndex].classList.remove('active');
      journeyIndex = (journeyIndex + 1) % journeySteps.length;
      journeySteps[journeyIndex].classList.add('active');
    }, 2400);
  }

  const clusterCopy = {
    foundation: ['01', 'Foundation', 'Put institutional identity, structure and authority in place.', 'Configure the school around its campuses, academic model, users and operating rules so every connected workflow begins from an authorised foundation.'],
    academic: ['02', 'Academic execution', 'Make teaching, attendance and progression visible.', 'Connect admissions, timetables, session attendance, classroom delivery, examinations, grading and official records across the academic cycle.'],
    people: ['03', 'People', 'Give each learner and staff member the right institutional context.', 'Keep authorised student, guardian, staff, conduct and wellbeing information connected while respecting role and record boundaries.'],
    finance: ['04', 'Finance', 'Move from collection to institutional control.', 'Connect fee structures, payments, receipts, accounting, reconciliation and payroll through governed approvals and timely insight.'],
    operations: ['05', 'Operations', 'Bring the daily school out of separate notebooks.', 'Manage boarding, health, library, stores, assets and transport as connected parts of the same accountable institution.'],
    engagement: ['06', 'Engagement & insight', 'Turn authorised information into timely action.', 'Coordinate approvals, communication, notifications and leadership indicators so the right person can respond while action is still useful.']
  };
  const clusterPanel = $('#cluster-panel');
  $$('.cluster-tab').forEach(button => button.addEventListener('click', () => {
    const [number, label, title, copy] = clusterCopy[button.dataset.cluster];
    $$('.cluster-tab').forEach(tab => { tab.classList.remove('active'); tab.setAttribute('aria-selected', 'false'); });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    clusterPanel.innerHTML = `<span class="panel-number">${number}</span><p class="eyebrow">${label}</p><h3>${title}</h3><p>${copy}</p>`;
    clusterPanel.classList.remove('refresh');
    void clusterPanel.offsetWidth;
    clusterPanel.classList.add('refresh');
  }));

  const stakeholderCopy = {
    leaders: {
      label: 'For school leaders', title: 'Leaders see risks and priorities earlier.', copy: 'Bring academic coverage, attendance, finance, operational capacity and governance evidence into one timely view.',
      rows: [['Academic','Coverage, assessment and progression'],['Attendance','Absence, lateness and intervention'],['Finance','Collection, arrears and reconciliation'],['Operations','Capacity, stock and service exceptions'],['Governance','Approvals, accountability and audit evidence']]
    },
    teachers: {
      label: 'For teachers', title: 'Spend less time rebuilding the record.', copy: 'Keep planning, delivery, attendance, assessment and family follow-up connected around the classes a teacher is authorised to serve.',
      rows: [['Plan','Lessons, curriculum and class schedules'],['Teach','Topic delivery and learning resources'],['Attend','Session records and exceptions'],['Assess','Scores, moderation and published results'],['Follow up','Learner evidence and family communication']]
    },
    families: {
      label: 'For families', title: 'Families receive timely, actionable visibility.', copy: 'See authorised school information, act on important requests and support the learner while action is still useful.',
      rows: [['See','Attendance, published results, assignments and notices'],['Act','Pay fees, acknowledge communication and follow up'],['Support','Receive authorised learning recommendations'],['Connect','Keep school-family communication documented'],['Trust','Know that school authority remains with accountable people']]
    },
    learners: {
      label: 'For learners', title: 'Make progress more visible and support more relevant.', copy: 'Connect the learner’s school record to timely feedback, purposeful practice and a clearer path through the academic journey.',
      rows: [['Know','Published results and relevant feedback'],['Prepare','Assignments and guided homework support'],['Practise','Curriculum-aligned mastery activities'],['Progress','Evidence for intervention and progression'],['Protect','Appropriate access and human oversight']]
    }
  };
  const stakePanel = $('#stake-panel');
  $$('.stake-tab').forEach(button => button.addEventListener('click', () => {
    const item = stakeholderCopy[button.dataset.stake];
    $$('.stake-tab').forEach(tab => { tab.classList.remove('active'); tab.setAttribute('aria-selected', 'false'); });
    button.classList.add('active'); button.setAttribute('aria-selected', 'true');
    stakePanel.innerHTML = `<div><p class="eyebrow">${item.label}</p><h3>${item.title}</h3><p>${item.copy}</p></div><ul>${item.rows.map(row => `<li><b>${row[0]}</b><span>${row[1]}</span></li>`).join('')}</ul>`;
    stakePanel.classList.remove('refresh');
    void stakePanel.offsetWidth;
    stakePanel.classList.add('refresh');
  }));

  const demoForm = $('#demo-form');
  demoForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(demoForm);
    const message = [
      'Hello AYIVI Systems Limited, I would like to schedule a Sukuu ERP discovery session and demonstration.',
      '', `Name: ${data.get('name')}`, `Institution: ${data.get('school')}`, `Role: ${data.get('role') || 'Not provided'}`, `Phone: ${data.get('phone')}`, `Priority: ${data.get('priority')}`, `Context: ${data.get('message') || 'Not provided'}`
    ].join('\n');
    window.open(`https://wa.me/233207777747?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  const backToTop = $('.back-to-top');
  window.addEventListener('scroll', () => backToTop?.classList.toggle('show', window.scrollY > 700), { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('#year').textContent = String(new Date().getFullYear());
})();
