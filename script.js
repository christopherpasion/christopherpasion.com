/**
 * Christopher Pasion — Portfolio Scripts
 * Minimal, accessible, zero-dependency vanilla JS (<3KB)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year Update
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Email Copy Button with Accessible Feedback
  const copyBtn = document.getElementById('btn-copy-email');
  const copyText = document.getElementById('btn-copy-text');

  if (copyBtn && copyText) {
    const originalText = copyText.textContent;
    let resetTimer = null;

    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'mail@christopherpasion.com';
      
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual and accessible confirmation
        copyText.textContent = 'Copied to Clipboard!';
        copyBtn.style.borderColor = 'var(--accent-green)';
        copyBtn.style.color = 'var(--accent-green)';
        copyBtn.setAttribute('aria-label', 'Email address copied to clipboard');

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          copyText.textContent = originalText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
          copyBtn.setAttribute('aria-label', 'Copy email address to clipboard');
        }, 2500);

      } catch (err) {
        console.error('Failed to copy email:', err);
        copyText.textContent = 'Copy failed';
        setTimeout(() => {
          copyText.textContent = originalText;
        }, 2000);
      }
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('nav-mobile-toggle');
  const navMenu = document.getElementById('site-nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking any nav anchor link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 4. Contact Form Handling & Honeypot Anti-Spam
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');
  const submitBtn = document.getElementById('btn-submit-contact');

  if (contactForm && statusMsg && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot field
      const honeypot = document.getElementById('contact-bot-field');
      if (honeypot && honeypot.value.trim() !== '') {
        // Bot detected: silently drop and simulate standard completion
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = 'Message sent successfully.';
        contactForm.reset();
        return;
      }

      // Client validation
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        statusMsg.className = 'form-status-msg error';
        statusMsg.textContent = 'Please fill out all required fields.';
        return;
      }

      // Prevent duplicate rapid submissions
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preparing...';

      // Open user's default email client pre-filled cleanly
      const mailtoUrl = `mailto:mail@christopherpasion.com?subject=${encodeURIComponent(
        `[christopherpasion.com] ${subject}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoUrl;

      statusMsg.className = 'form-status-msg success';
      statusMsg.textContent = 'Opening your email client...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 3000);
    });
  }
});
