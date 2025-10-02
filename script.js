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

    // --- Waitlist Form Submission ---
    const waitlistForm = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const submitButton = waitlistForm.querySelector('button[type="submit"]');

    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from reloading the page

        const email = emailInput.value;

        // Simple validation
        if (email && validateEmail(email)) {
            // Change button text to show loading/processing state
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;

            // --- IMPORTANT ---
            // In a real application, you would make an API call here
            // to your backend (like Supabase, Firebase, or a custom server)
            // to save the email address to your waitlist database.
            // For example:
            //
            // fetch('https://your-api-endpoint.com/join-waitlist', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: email })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Success:', data);
            //     submitButton.textContent = '✅ You\'re on the list!';
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            //     submitButton.textContent = 'Something went wrong!';
            //     submitButton.disabled = false; // Re-enable on error
            // });


            // --- SIMULATION FOR THIS EXAMPLE ---
            // We'll simulate a successful API call with a 1.5-second delay.
            setTimeout(() => {
                submitButton.style.backgroundColor = '#22c55e'; // Green color for success
                submitButton.textContent = '✅ Success! You\'re on the list.';
                // The button remains disabled to prevent multiple submissions.
                console.log(`Simulated submission for email: ${email}`);
            }, 1500);

        } else {
            // Handle invalid email
            alert('Please enter a valid email address.');
        }
    });

    // --- Helper function for email validation ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

});