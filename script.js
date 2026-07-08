/* =========================================================
   DECODELABS — PROJECT 1
   Basic state management & interactive functionality
   (Vanilla JS only — no frameworks, per project mandate)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Mobile Nav Toggle (state: open/closed) ---------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = primaryNav.querySelectorAll('.nav-link');

  function setNavState(isOpen) {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    primaryNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavState(!isOpen);
  });

  // Close mobile nav after a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => setNavState(false));
  });

  // Close nav on Escape key (accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavState(false);
      navToggle.focus();
    }
  });

  /* ---------- 2. Active Nav Link Highlight on Scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach(section => observer.observe(section));

  /* ---------- 3. Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 4. Contact Form Validation (state + feedback) ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function validateField(key) {
    const { el, error } = fields[key];
    let message = '';

    if (el.value.trim() === '') {
      message = 'This field is required.';
    } else if (key === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(el.value.trim())) {
        message = 'Please enter a valid email address.';
      }
    } else if (key === 'message' && el.value.trim().length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.classList.toggle('invalid', Boolean(message));
    el.setAttribute('aria-invalid', String(Boolean(message)));

    return message === '';
  }

  // Live validation as the user types (state management per field)
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = Object.keys(fields)
      .map(validateField)
      .every(Boolean);

    if (!isValid) {
      formStatus.textContent = 'Please fix the errors above before submitting.';
      formStatus.style.color = '#c0392b';
      return;
    }

    // Simulated submit success (no backend in this project — frontend only)
    formStatus.textContent = `Thanks, ${fields.name.el.value.trim()}! Your message has been received.`;
    formStatus.style.color = '#2E2A26';
    form.reset();
  });

  /* ---------- 5. Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
