document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('message');
    const successIcon = '<svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Simulate submission (you can replace this with actual submission logic)
        setTimeout(() => {
            showMessage('Booking successfull.Our team members will be in touch with you shortly.');
            form.reset();
        }, 1000);
    });

    function showMessage(message) {
        const successBox = document.createElement('div');
        successBox.classList.add('success-box');
        successBox.innerHTML = successIcon + message;
        messageDiv.appendChild(successBox);
        messageDiv.style.display = 'block';
        setTimeout(() => {
            successBox.remove();
            messageDiv.style.display = 'none';
        }, 3000);
    }
});
