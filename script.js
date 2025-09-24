document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('nav a[href^="#"], .hero-content a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Waitlist Form Submission ---
    const waitlistForm = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('form-success-message');
    const submitButton = waitlistForm.querySelector('button[type="submit"]');

    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents the default form submission

        // You would typically send the data to a server here.
        // For this example, we'll just show a success message.
        
        const emailInput = document.getElementById('email');
        if (emailInput.value && emailInput.checkValidity()) {
            
            // Hide the form fields and button
            waitlistForm.querySelector('.input-group').style.display = 'none';
            waitlistForm.querySelector('.checkbox-group').style.display = 'none';
            submitButton.style.display = 'none';
            
            // Show the success message
            successMessage.classList.remove('hidden');

            console.log(`Email submitted: ${emailInput.value}`);
        } else {
            // Optional: Add some validation feedback if needed
            alert("Please enter a valid email address.");
        }
    });

});