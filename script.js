// script.js
// Nav toggle, project filter, flag/display handling, contact form with server-side POST + mailto fallback

document.addEventListener('DOMContentLoaded', function () {
  const translations = {
    en: {
      navAbout: 'About',
      navProjects: 'Projects',
      navContact: 'Contact',
      langToggleLabel: 'Norsk',
      langToggleIcon: 'https://flagpedia.net/data/flags/emoji/twitter/256x256/no.png',
      langToggleAria: 'Switch language to Norwegian',
      heroTitle: 'I turn ideas into working products: practical, reliable, and easy to use.',
      heroLead: '',
      heroShort: 'I work across development, testing and systems improvements at INFINITY CROWN INC. I solve problems at the intersection of engineering and user experience. I focus on clean builds, thoughtful QA and steady improvements.',
      ctaScandinavia: 'For Scandinavia — infinitycrown.no <span class="flag">🇳🇴🇸🇪🇩🇰</span>',
      ctaNorthAmerica: 'For North America — infinitycrown.ca <span class="flag">🇨🇦🇺🇸</span>',
      focusAreas: '<strong>Focus areas</strong> — user experience, scalable systems, practical product engineering',
      education: '<strong>Education</strong> — Computer Engineering (Software), Toronto Metropolitan University',
      projectsTitle: 'Selected projects',
      projectsSubtitle: 'Public repositories and notable forks. Tap a card to open the GitHub repo.',
      projectFilterPlaceholder: 'Filter projects by name or language',
      viewAllLabel: 'View all projects',
      viewLessLabel: 'Show fewer',
      contactTitle: 'Contact information',
      contactSubtitle: 'For business inquiries please reach out through INFINITY CROWN INC. Choose your market below and send a short message.',
      contactCardScandinaviaTitle: 'Scandinavia',
      contactCardScandinaviaText: '<span class="flag">🇳🇴 🇸🇪 🇩🇰</span> <a href="https://web.infinitycrown.no/pages/contact" target="_blank" rel="noopener">infinitycrown.no</a>',
      contactCardNorthAmericaTitle: 'North America',
      contactCardNorthAmericaText: '<span class="flag">🇨🇦 🇺🇸</span> <a href="https://web.infinitycrown.ca/pages/contact" target="_blank" rel="noopener">infinitycrown.ca</a>',
      contactCardSocialTitle: 'Social & Code',
      contactCardSocialText: '<a href="https://github.com/nidushan" target="_blank" rel="noopener">GitHub</a> • <a href="https://linkedin.com/in/nidushan/" target="_blank" rel="noopener">LinkedIn</a>',
      footerCopyright: '© Copyright INFINITY CROWN INC | All Rights Reserved',
      footerLocation: 'Based in Toronto, Canada'
    },
    no: {
      navAbout: 'Om',
      navProjects: 'Prosjekter',
      navContact: 'Kontakt informasjon',
      langToggleLabel: 'English',
      langToggleIcon: 'https://flagpedia.net/data/flags/emoji/twitter/256x256/ca.png',
      langToggleAria: 'Switch language to English',
      heroTitle: 'Jeg gjør idéer om til fungerende produkter: praktisk, pålitelig og brukervennlig.',
      heroLead: '',
      heroShort: 'Jeg jobber med utvikling, testing og systemforbedringer i INFINITY CROWN AS. Jeg løser problemer i skjæringspunktet mellom ingeniørarbeid og brukeropplevelse. Jeg fokuserer på rene leveranser, gjennomtenkt QA og jevnlige forbedringer.',
      ctaScandinavia: 'For Skandinavia — infinitycrown.no <span class="flag">🇳🇴🇸🇪🇩🇰</span>',
      ctaNorthAmerica: 'For Nord-Amerika — infinitycrown.ca <span class="flag">🇨🇦🇺🇸</span>',
      focusAreas: '<strong>Fokusområder</strong> — brukeropplevelse, skalerbare systemer, praktisk produktutvikling',
      education: '<strong>Utdanning</strong> — Computer Engineering (Software), Toronto Metropolitan University',
      projectsTitle: 'Utvalgte prosjekter',
      projectsSubtitle: 'Offentlige repoer og merkbare forks. Trykk på et kort for å åpne GitHub-repoen.',
      projectFilterPlaceholder: 'Filtrer prosjekter etter navn eller språk',
      viewAllLabel: 'Vis alle prosjekter',
      viewLessLabel: 'Vis færre',
      contactTitle: 'Kontakt',
      contactSubtitle: 'For forretningshenvendelser, ta kontakt via INFINITY CROWN AS. Velg marked og send en kort melding.',
      contactCardScandinaviaTitle: 'Skandinavia',
      contactCardScandinaviaText: '<span class="flag">🇳🇴 🇸🇪 🇩🇰</span> <a href="https://web.infinitycrown.no/pages/contact" target="_blank" rel="noopener">infinitycrown.no</a>',
      contactCardNorthAmericaTitle: 'Nord-Amerika',
      contactCardNorthAmericaText: '<span class="flag">🇨🇦 🇺🇸</span> <a href="https://web.infinitycrown.ca/pages/contact" target="_blank" rel="noopener">infinitycrown.ca</a>',
      contactCardSocialTitle: 'Sosial & kode',
      contactCardSocialText: '<a href="https://github.com/nidushan" target="_blank" rel="noopener">GitHub</a> • <a href="https://linkedin.com/in/nidushan/" target="_blank" rel="noopener">LinkedIn</a>',
      footerCopyright: '© Copyright INFINITY CROWN AS',
      footerLocation: 'Based in Stavanger, Norway'
    }
  };

  const langToggleBtn = document.getElementById('langToggle');
  const langToggleLabel = document.querySelector('#langToggle .lang-toggle-label');
  const langToggleIcon = document.getElementById('langToggleIcon');
  const projectFilter = document.getElementById('projectFilter');
  const viewAllBtn = document.getElementById('viewAllProjectsBtn');
  const FLAG_BREAKPOINT = 720;
  let currentLang = localStorage.getItem('language') || 'en';
  let projectsExpanded = false;

  function applyTranslations(lang) {
    const locale = translations[lang] ? lang : 'en';
    document.documentElement.lang = locale;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = translations[locale][key];
      if (typeof value === 'undefined') return;
      if (value.includes('<')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    if (projectFilter) {
      projectFilter.placeholder = translations[locale].projectFilterPlaceholder;
    }
    if (viewAllBtn) {
      viewAllBtn.textContent = projectsExpanded ? translations[locale].viewLessLabel : translations[locale].viewAllLabel;
      viewAllBtn.setAttribute('aria-expanded', String(projectsExpanded));
    }
    if (langToggleLabel) {
      langToggleLabel.textContent = translations[locale].langToggleLabel;
    }
    if (langToggleIcon) {
      langToggleIcon.src = translations[locale].langToggleIcon;
    }
    if (langToggleBtn) {
      langToggleBtn.setAttribute('aria-label', translations[locale].langToggleAria);
      langToggleBtn.setAttribute('aria-pressed', String(locale === 'no'));
    }
    localStorage.setItem('language', locale);
  }

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'no' : 'en';
    applyTranslations(currentLang);
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  applyTranslations(currentLang);

  // NAV toggle
  const btn = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target) && nav.classList.contains('show')) {
        nav.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // PROJECT filter
  const filterInput = document.getElementById('projectFilter');
  const projectsGrid = document.getElementById('projectsGrid');
  function updateProjectCardLimit() {
    const isMobile = window.innerWidth <= FLAG_BREAKPOINT;
    const cards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    cards.forEach(card => card.classList.remove('collapsed-hidden'));
    const visibleCards = cards.filter(card => card.style.display !== 'none');

    const shouldShowButton = isMobile && visibleCards.length > 3;
    if (!isMobile || projectsExpanded) {
      if (viewAllBtn) {
        viewAllBtn.hidden = !shouldShowButton;
        viewAllBtn.textContent = projectsExpanded ? translations[currentLang].viewLessLabel : translations[currentLang].viewAllLabel;
        viewAllBtn.setAttribute('aria-expanded', String(projectsExpanded));
      }
      return;
    }

    visibleCards.forEach((card, idx) => {
      if (idx >= 3) {
        card.classList.add('collapsed-hidden');
      }
    });

    if (viewAllBtn) {
      viewAllBtn.hidden = !shouldShowButton;
      viewAllBtn.textContent = translations[currentLang].viewAllLabel;
      viewAllBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (filterInput && projectsGrid) {
    filterInput.addEventListener('input', (e) => {
      const q = String(e.target.value || '').trim().toLowerCase();
      const cards = projectsGrid.querySelectorAll('.project-card');
      cards.forEach(card => {
        if (!q) { card.style.display = ''; return; }
        const name = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.desc')?.textContent || '').toLowerCase();
        const tag = (card.querySelector('.lang')?.textContent || '').toLowerCase();
        const hay = name + ' ' + desc + ' ' + tag;
        card.style.display = hay.includes(q) ? '' : 'none';
      });
      updateProjectCardLimit();
    });
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      projectsExpanded = !projectsExpanded;
      updateProjectCardLimit();
    });
  }

  if (projectsGrid) {
    updateProjectCardLimit();
  }

  // FLAGS: show only on mobile. Also change select option text to remove emojis on desktop.
  const flagElements = document.querySelectorAll('.flag');
  const regionSelect = document.getElementById('region');

  function updateFlagAndSelectDisplay() {
    const isMobile = window.innerWidth <= FLAG_BREAKPOINT;
    // toggle inline flag spans
    flagElements.forEach(el => {
      el.style.display = isMobile ? 'inline-block' : 'none';
    });
    // change select option text to include or exclude emojis
    if (regionSelect) {
      Array.from(regionSelect.options).forEach(opt => {
        const noemoji = opt.dataset.noemoji;
        if (!noemoji) return;
        opt.textContent = isMobile ? (opt.textContent.includes(noemoji) ? opt.textContent : (opt.getAttribute('data-noemoji') ? (opt.getAttribute('data-noemoji')) : opt.textContent)) : noemoji;
        // If isMobile and option currently shows noemoji, set it to emoji form stored in a data attr
        if (isMobile && opt.dataset.emoji) {
          opt.textContent = opt.dataset.emoji;
        }
        // To allow toggling from the stored data, optionally store emoji in dataset on first pass
        if (!opt.dataset.emoji && opt.textContent.match(/[\u{1F1E6}-\u{1F1FF}]/u)) {
          opt.dataset.emoji = opt.textContent;
        }
      });
    }
  }

  // ensure initial state
  updateFlagAndSelectDisplay();
  // update on resize (throttled-ish)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateFlagAndSelectDisplay();
      updateProjectCardLimit();
    }, 120);
  });

  // CONTACT FORM: try server-side POST first, fallback to mailto
  const form = document.getElementById('contactForm');
  const mailFallback = document.getElementById('mailtoFallback');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  function buildMailTo({ to, subject, body, cc }) {
    let href = 'mailto:' + encodeURIComponent(to || '');
    const params = [];
    if (subject) params.push('subject=' + encodeURIComponent(subject));
    if (cc) params.push('cc=' + encodeURIComponent(cc));
    if (body) params.push('body=' + encodeURIComponent(body));
    if (params.length) href += '?' + params.join('&');
    return href;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData));

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json,
        });

        const result = await res.json();
        if (res.status === 200) {
          if (formMessage) {
            formMessage.classList.add('success');
            formMessage.textContent = 'Message sent — thank you. I will respond shortly.';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Something went wrong');
        }
      } catch (err) {
        // fallback: construct mailto so visitor can use their mail client
        if (formMessage) {
          formMessage.classList.add('error');
          formMessage.textContent = 'Server send failed. Opening your email client as a fallback.';
        }

        const name = formData.get('name');
        const email = formData.get('email');
        const region = formData.get('region');
        const message = formData.get('message');

        const to = region === 'northamerica' ? 'contact@infinitycrown.ca' : 'contact@infinitycrown.no';
        const subject = `Website contact from ${name || 'Website visitor'}`;
        const body = `Name: ${name}\nEmail: ${email}\nRegion: ${region}\n\nMessage:\n${message}`;
        // small delay so message is readable
        setTimeout(() => {
          window.location.href = buildMailTo({ to, subject, body });
        }, 700);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        }
      }
    });
  }

  if (mailFallback) {
    mailFallback.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim() || '—';
      const email = document.getElementById('email').value.trim() || '—';
      const region = document.getElementById('region').value || '—';
      const message = document.getElementById('message').value.trim() || '—';
      const to = region === 'northamerica' ? 'contact@infinitycrown.ca' : 'contact@infinitycrown.no';
      const subject = `Website contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nRegion: ${region}\n\nMessage:\n${message}`;
      window.location.href = buildMailTo({ to, subject, body });
    });
  }

  // TEST FORM
  const testForm = document.getElementById('testForm');
  if (testForm) {
    const testSubmitBtn = testForm.querySelector('button[type="submit"]');
    testForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(testForm);
      // Ensure access_key is set (using .set to avoid duplicates if hidden input exists)
      formData.set("access_key", "d02a84a9-d797-47a1-acff-cf3f23f0948d");

      const originalText = testSubmitBtn.textContent;
      testSubmitBtn.textContent = "Sending...";
      testSubmitBtn.disabled = true;

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          alert("Success! Your message has been sent.");
          testForm.reset();
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
      } finally {
        testSubmitBtn.textContent = originalText;
        testSubmitBtn.disabled = false;
      }
    });
  }
});