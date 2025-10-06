// --- PARTICLE BACKGROUND ---
    function createParticles() {
      const particlesContainer = document.getElementById('particles');
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
      }
    }

document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Supabase Connection ---
    // ⚠️ Replace with your actual Supabase URL and Anon Key
    const SUPABASE_URL = 'https://yfvrqgpuetissvhibfkp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdnJxZ3B1ZXRpc3N2aGliZmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODM3MzMsImV4cCI6MjA3NDk1OTczM30.8l9eMbT_YrS36VBtx0wv4ta9_i8CuScc5ZCpeDTsAes';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase Initialized!');

    // --- Waitlist Form Submission ---
    const waitlistForm = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const submitButton = waitlistForm.querySelector('button[type="submit"]');

    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the form from reloading the page
        const email = emailInput.value.trim();

        if (email && validateEmail(email)) {
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;

            // --- Save the email to Supabase ---
            try {
                const { data, error } = await supabase
                    .from('waitlist') // The name of your table
                    .insert([
                        { email: email } // The column name and value
                    ]);

                if (error) {
                    // This will catch errors like duplicate emails if you set your
                    // email column to be UNIQUE in the Supabase table settings.
                    console.error('Supabase error:', error.message);
                    submitButton.style.backgroundColor = '#ef4444'; // Red for error
                    submitButton.textContent = 'Error: Email may already be on list.';
                    // Re-enable after a few seconds so user can try again
                    setTimeout(() => {
                        submitButton.textContent = 'Join the PrepPal Waitlist & Get Early Access!';
                        submitButton.style.backgroundColor = ''; // Revert color
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    console.log('Successfully added to waitlist:', data);
                    submitButton.style.backgroundColor = '#22c55e'; // Green for success
                    submitButton.textContent = '✅ Success! You\'re on the list.';
                    // Button remains disabled after success
                }
            } catch (err) {
                console.error('An unexpected error occurred:', err);
                submitButton.textContent = 'An error occurred!';
                submitButton.disabled = false;
            }

        } else {
            alert('Please enter a valid email address.');
        }
    });

    // --- Helper function for email validation ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});