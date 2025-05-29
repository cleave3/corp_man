const submit_btn = document.getElementById('submit-btn')
const password = document.getElementById('password')
const confirm_password = document.getElementById('confirm_password')
const resetForm = document.getElementById('reset-form');

password.addEventListener('input', () => {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if (!passwordPattern.test(password.value)) {
        password.setCustomValidity('Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one digit');
        return;
    }
    password.setCustomValidity('');
});

confirm_password.addEventListener('input', () => {
    if (confirm_password.value.length < 8) {
        confirm_password.setCustomValidity('Password must be at least 8 characters');
    } else if (password.value !== confirm_password.value) {
        confirm_password.setCustomValidity('Passwords do not match');
    } else {
        confirm_password.setCustomValidity('');
    }
});

resetForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        if (password.value !== confirm_password.value) {
            alert('Passwords do not match');
            return;
        }
        submit_btn.disabled = true;
        submit_btn.innerHTML = 'Submitting...';
        const response = await fetch(resetForm.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ new_password: password.value })
        });
        const data = await response.json();
        if (!data.status) throw new Error(data.message);
        
        window.location.href = '/api/v1/auth/reset-success';
    } catch ({ message}) {
        alert(message);              
    } finally {
        submit_btn.disabled = false;
        submit_btn.innerHTML = 'Reset Password'; 
    }
});