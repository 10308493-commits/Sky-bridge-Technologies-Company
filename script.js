document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        const items = navLinks.querySelectorAll('.nav-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const settingsBtn = document.getElementById('cookie-settings');

    const STORAGE_KEY = 'sky_bridge_cookies_accepted';

    const showBanner = () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
                // Trigger animation
                requestAnimationFrame(() => {
                    cookieBanner.classList.add('visible');
                });
            }, 1000); // Show after 1 second
        }
    };

    const hideBanner = () => {
        cookieBanner.classList.remove('visible');
        setTimeout(() => {
            cookieBanner.classList.add('hidden');
        }, 600); // Match CSS transition time
    };

    if (cookieBanner && acceptBtn) {
        showBanner();

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, 'true');
            hideBanner();
        });

        settingsBtn.addEventListener('click', () => {
            window.location.href = 'cookie-policy.html';
        });
    }

    // Header scroll effect
    const header = document.getElementById('main-nav');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.padding = '0.5rem 0';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.style.padding = '0';
                header.style.backgroundColor = 'var(--nav-bg)';
            }
        });
    }

    // Display Logged-in User
    const userEmailTag = document.getElementById('user-display-email');
    const navSigninBtn = document.getElementById('nav-signin-btn');
    const SESSION_KEY = 'sky_bridge_user_session';

    const checkSession = () => {
        const loggedUser = localStorage.getItem(SESSION_KEY);
        if (loggedUser && userEmailTag && navSigninBtn) {
            userEmailTag.innerText = loggedUser;
            userEmailTag.style.display = 'block';
            navSigninBtn.innerText = 'Logout';
            navSigninBtn.href = '#';
            navSigninBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem(SESSION_KEY);
                window.location.reload();
            });
        }
    };

    checkSession();

    // Sign In & Sign Up Form Logic
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    // Password Toggles
    const setupPasswordToggle = (toggleId, inputId) => {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                toggle.classList.toggle('fa-eye');
                toggle.classList.toggle('fa-eye-slash');
            });
        }
    };

    setupPasswordToggle('toggle-password', 'password');
    setupPasswordToggle('toggle-confirm-password', 'confirm-password');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');

            let isValid = true;

            // Simple email/username validation
            if (email.value.trim().length < 3) {
                email.classList.add('error');
                emailError.style.display = 'block';
                isValid = false;
            } else {
                email.classList.remove('error');
                emailError.style.display = 'none';
            }

            // Password validation
            if (password.value.length < 6) {
                password.classList.add('error');
                passwordError.style.display = 'block';
                isValid = false;
            } else {
                password.classList.remove('error');
                passwordError.style.display = 'none';
            }

            if (isValid) {
                const btn = signinForm.querySelector('button');
                btn.innerText = 'Signing In...';
                btn.disabled = true;
                btn.style.opacity = '0.7';

                // Simulate API call
                setTimeout(() => {
                    localStorage.setItem(SESSION_KEY, email.value);
                    alert('Sign In Successful!');
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            const terms = document.getElementById('terms');

            const fullnameError = document.getElementById('fullname-error');
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            const confirmError = document.getElementById('confirm-password-error');
            const termsError = document.getElementById('terms-error');

            let isValid = true;

            // Full Name
            if (fullname.value.trim().length < 2) {
                fullname.classList.add('error');
                fullnameError.style.display = 'block';
                isValid = false;
            } else {
                fullname.classList.remove('error');
                fullnameError.style.display = 'none';
            }

            // Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                email.classList.add('error');
                emailError.style.display = 'block';
                isValid = false;
            } else {
                email.classList.remove('error');
                emailError.style.display = 'none';
            }

            // Password
            if (password.value.length < 8) {
                password.classList.add('error');
                passwordError.style.display = 'block';
                isValid = false;
            } else {
                password.classList.remove('error');
                passwordError.style.display = 'none';
            }

            // Confirm Password
            if (confirmPassword.value !== password.value || confirmPassword.value === '') {
                confirmPassword.classList.add('error');
                confirmError.style.display = 'block';
                isValid = false;
            } else {
                confirmPassword.classList.remove('error');
                confirmError.style.display = 'none';
            }

            // Terms
            if (!terms.checked) {
                termsError.style.display = 'block';
                isValid = false;
            } else {
                termsError.style.display = 'none';
            }

            if (isValid) {
                const btn = signupForm.querySelector('button');
                btn.innerText = 'Creating Account...';
                btn.disabled = true;
                btn.style.opacity = '0.7';

                // Simulate API call
                setTimeout(() => {
                    localStorage.setItem(SESSION_KEY, email.value);
                    alert('Account Created Successfully! Welcome to Sky Bridge.');
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }

    // Clear error on input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorId = input.id + '-error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) errorElement.style.display = 'none';
        });
    });
    // Scroll Reveal Animation
    const scrollReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        scrollReveal.observe(el);
    });
});
