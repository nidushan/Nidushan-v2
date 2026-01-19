// script.js
// Nav toggle, project filter, flag/display handling, contact form with server-side POST + mailto fallback

document.addEventListener('DOMContentLoaded', function () {
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
    });
  }

  // FLAGS: show only on mobile. Also change select option text to remove emojis on desktop.
  const FLAG_BREAKPOINT = 720;
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
    resizeTimer = setTimeout(updateFlagAndSelectDisplay, 120);
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