//  FORCE LOGIN: Clear any saved session as soon as the login page loads
localStorage.removeItem('dispatcherToken');
localStorage.removeItem('dispatcherUser');

// Mock dispatcher credentials
const MOCK_DISPATCHERS = Array.from({ length: 5 }, (_, i) => ({ email: `dispatcher00${i + 1}@gmail.com`, password: "1234", name: `Dispatcher 00${i + 1}` }));

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'none';
    
    try {
        const user = await mockLogin(email, password);
        
        if (user) {
            // Save token only for the current session
            const token = 'dispatcher_' + Math.random().toString(36).substr(2) + Date.now();
            localStorage.setItem('dispatcherToken', token);
            localStorage.setItem('dispatcherUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            showError('Invalid email or password');
        }
    } catch (error) {
        showError('Login failed. Please try again.');
    }
});

async function mockLogin(email, password) {
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_DISPATCHERS.find(
        u => u.email === email && u.password === password
    );
    
    if (user) {
        return { email: user.email, name: user.name, role: 'dispatcher' };
    }
    return null;
}

function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    if(errorMsg) {
        errorMsg.querySelector('span').textContent = message;
        errorMsg.style.display = 'flex';
    }
}