/**
 * contact.js — Sky Bridge Technologies Contact Page
 * Handles: form validation, character counter, scroll animations,
 *          smooth scroll, and mobile nav (mirrors script.js behaviour).
 */

'use strict';

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email-address');
const phoneInput = document.getElementById('phone-number');
const subjectSelect = document.getElementById('subject');
const messageTextarea = document.getElementById('message');
const charCounter = document.getElementById('char-counter');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const formErrorGeneral = document.getElementById('form-error-general');
const serverFeedback = document.getElementById('server-feedback');

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Show an error message for a given input field.
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function showError(input, errorEl) {
    input.classList.add('error');
    if (errorEl) {
        errorEl.classList.add('visible');
        errorEl.style.display = 'block';
    }
}

/**
 * Clear the error state for a given input field.
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function clearError(input, errorEl) {
    input.classList.remove('error');
    if (errorEl) {
        errorEl.classList.remove('visible');
        errorEl.style.display = 'none';
    }
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* ============================================================
   CHARACTER COUNTER FOR TEXTAREA
   ============================================================ */
if (messageTextarea && charCounter) {
    messageTextarea.addEventListener('input', function () {
        const length = this.value.length;
        const max = parseInt(this.getAttribute('maxlength'), 10) || 500;
        charCounter.textContent = `${length} / ${max}`;

        // Warn when within 50 characters of the limit
        if (length >= max - 50) {
            charCounter.classList.add('near-limit');
        } else {
            charCounter.classList.remove('near-limit');
        }
    });
}

/* ============================================================
   REAL-TIME INLINE VALIDATION (on blur)
   ============================================================ */

// Full Name
if (fullNameInput) {
    fullNameInput.addEventListener('blur', function () {
        const errorEl = document.getElementById('full-name-error');
        if (this.value.trim().length < 2) {
            showError(this, errorEl);
        } else {
            clearError(this, errorEl);
        }
    });
    fullNameInput.addEventListener('input', function () {
        if (this.value.trim().length >= 2) {
            clearError(this, document.getElementById('full-name-error'));
        }
    });
}

// Email
if (emailInput) {
    emailInput.addEventListener('blur', function () {
        const errorEl = document.getElementById('email-error');
        if (!isValidEmail(this.value)) {
            showError(this, errorEl);
        } else {
            clearError(this, errorEl);
        }
    });
    emailInput.addEventListener('input', function () {
        if (isValidEmail(this.value)) {
            clearError(this, document.getElementById('email-error'));
        }
    });
}

// Subject
if (subjectSelect) {
    subjectSelect.addEventListener('change', function () {
        const errorEl = document.getElementById('subject-error');
        if (this.value) {
            clearError(this, errorEl);
        }
    });
}

// Message
if (messageTextarea) {
    messageTextarea.addEventListener('blur', function () {
        const errorEl = document.getElementById('message-error');
        if (this.value.trim().length < 10) {
            showError(this, errorEl);
        } else {
            clearError(this, errorEl);
        }
    });
    messageTextarea.addEventListener('input', function () {
        if (this.value.trim().length >= 10) {
            clearError(this, document.getElementById('message-error'));
        }
    });
}

/* ============================================================
   FORM SUBMISSION & FULL VALIDATION
   ============================================================ */
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Hide any previous feedback
        formSuccess.classList.add('hidden');
        formErrorGeneral.classList.add('hidden');

        let isValid = true;

        // --- Validate Full Name ---
        const nameErrorEl = document.getElementById('full-name-error');
        if (!fullNameInput || fullNameInput.value.trim().length < 2) {
            showError(fullNameInput, nameErrorEl);
            isValid = false;
        } else {
            clearError(fullNameInput, nameErrorEl);
        }

        // --- Validate Email ---
        const emailErrorEl = document.getElementById('email-error');
        if (!emailInput || !isValidEmail(emailInput.value)) {
            showError(emailInput, emailErrorEl);
            isValid = false;
        } else {
            clearError(emailInput, emailErrorEl);
        }

        // --- Validate Subject ---
        const subjectErrorEl = document.getElementById('subject-error');
        if (!subjectSelect || !subjectSelect.value) {
            showError(subjectSelect, subjectErrorEl);
            isValid = false;
        } else {
            clearError(subjectSelect, subjectErrorEl);
        }

        // --- Validate Message ---
        const messageErrorEl = document.getElementById('message-error');
        if (!messageTextarea || messageTextarea.value.trim().length < 10) {
            showError(messageTextarea, messageErrorEl);
            isValid = false;
        } else {
            clearError(messageTextarea, messageErrorEl);
        }

        // --- Validate reCAPTCHA (only if the widget is present on the page) ---
        const recaptchaWidget = document.querySelector('.g-recaptcha');
        const recaptchaErrorEl = document.getElementById('recaptcha-error');
        if (recaptchaWidget) {
            // grecaptcha is loaded by the reCAPTCHA API script
            const recaptchaValue = typeof grecaptcha !== 'undefined'
                ? grecaptcha.getResponse()
                : 'skip'; // skip check if API not loaded (e.g. localhost without key)
            if (!recaptchaValue) {
                if (recaptchaErrorEl) {
                    recaptchaErrorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                if (recaptchaErrorEl) {
                    recaptchaErrorEl.style.display = 'none';
                }
            }
        }

        // --- If invalid, show general error and scroll to first error ---
        if (!isValid) {
            formErrorGeneral.classList.remove('hidden');
            const firstError = contactForm.querySelector('.contact-input.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // --- All valid: show loading state then submit to PHP ---
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text-label').textContent = 'Sending…';
        submitBtn.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin btn-icon';

        // Small delay so the user sees the loading state, then submit
        setTimeout(function () {
            contactForm.submit();
        }, 400);
    });
}

/* ============================================================
   SCROLL-TRIGGERED FADE-IN ANIMATION
   (mirrors the behaviour in script.js for consistency)
   ============================================================ */
function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-in-on-scroll');
    if (!fadeEls.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    fadeEls.forEach(function (el) {
        observer.observe(el);
    });
}

/* ============================================================
   FOCUS HIGHLIGHT — input icon colour sync
   ============================================================ */
function initIconFocusSync() {
    const inputs = document.querySelectorAll('.contact-input');
    inputs.forEach(function (input) {
        const wrapper = input.closest('.form-input-wrapper');
        if (!wrapper) return;
        const icon = wrapper.querySelector('.form-input-icon');
        if (!icon) return;

        input.addEventListener('focus', function () {
            icon.style.color = 'var(--accent-color)';
        });
        input.addEventListener('blur', function () {
            icon.style.color = '';
        });
    });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initIconFocusSync();
    readServerFeedback();
});

/* ============================================================
   SERVER-SIDE FEEDBACK READER
   Reads ?status= and ?message= URL params written by PHP
   and displays them in the #server-feedback banner.
   ============================================================ */
function readServerFeedback() {
    if (!serverFeedback) return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const message = params.get('message');

    if (!status || !message) return;

    // Build the banner
    const isSuccess = status === 'success';
    const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';

    serverFeedback.innerHTML =
        `<i class="fas ${icon}"></i> <span>${message}</span>`;

    serverFeedback.classList.remove('hidden', 'form-success', 'form-error-general');
    serverFeedback.classList.add(isSuccess ? 'form-success' : 'form-error-general');

    // Scroll to the banner
    serverFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Clean the URL so refreshing doesn't re-show the message
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
}
