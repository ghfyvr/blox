document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const propertyGrid = document.getElementById('property-grid');
    const exploreBtn = document.getElementById('explore-btn');
    const viewAllBtn = document.getElementById('view-all-btn');
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');

    // Sample property data
    const properties = [
        {
            id: 1,
            title: 'Luxury Villa',
            price: '0.5 ETH',
            size: '1000 sqm',
            location: 'Prime District',
            image: 'villa'
        },
        {
            id: 2,
            title: 'Beachfront Property',
            price: '0.8 ETH',
            size: '1500 sqm',
            location: 'Coastal Zone',
            image: 'beach'
        },
        {
            id: 3,
            title: 'Mountain Retreat',
            price: '0.3 ETH',
            size: '800 sqm',
            location: 'Highlands',
            image: 'mountain'
        },
        {
            id: 4,
            title: 'City Skyscraper',
            price: '1.2 ETH',
            size: '5000 sqm',
            location: 'Downtown',
            image: 'skyscraper'
        }
    ];

    // Initialize the page
    function init() {
        renderProperties();
        setupEventListeners();
    }

    // Render properties to the grid
    function renderProperties() {
        propertyGrid.innerHTML = '';
        properties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.className = 'property-card';
            propertyCard.innerHTML = `
                <div class="property-image" style="background-color: ${getRandomColor()}"></div>
                <div class="property-details">
                    <h3 class="property-title">${property.title}</h3>
                    <p class="property-price">${property.price}</p>
                    <div class="property-meta">
                        <span>${property.size}</span>
                        <span>${property.location}</span>
                    </div>
                </div>
            `;
            propertyCard.addEventListener('click', () => viewPropertyDetails(property.id));
            propertyGrid.appendChild(propertyCard);
        });
    }

    // Generate random color for property images
    function getRandomColor() {
        const colors = ['#4a6bff', '#ff6b6b', '#6bff6b', '#ffcc4a', '#a46bff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // View property details (would navigate to detail page in full implementation)
    function viewPropertyDetails(id) {
        alert(`Viewing details for property ID: ${id}`);
        // In a real app, this would redirect to a property detail page
        // window.location.href = `/property?id=${id}`;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Modal controls
        loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
        registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.style.display = 'none';
            if (e.target === registerModal) registerModal.style.display = 'none';
        });
        
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
        
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
        
        // Form submissions
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        
        // Button actions
        exploreBtn.addEventListener('click', () => {
            document.querySelector('#marketplace').scrollIntoView({ behavior: 'smooth' });
        });
        
        viewAllBtn.addEventListener('click', () => {
            alert('Showing all properties (would load more in full implementation)');
        });
        
        // Legal links
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Terms of Service would be displayed here');
        });
        
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Privacy Policy would be displayed here');
        });
    }

    // Handle login form submission
    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            // In a real app, this would call your backend API
            const response = await mockApiCall('/api/auth/login', { email, password });
            
            if (response.success) {
                alert('Login successful!');
                loginModal.style.display = 'none';
                // In a real app, you would store the auth token and update UI
                loginBtn.textContent = 'My Account';
                registerBtn.style.display = 'none';
            } else {
                alert(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }

    // Handle registration form submission
    async function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        // Validation
        if (!username || !email || !password || !confirm) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }
        
        try {
            // In a real app, this would call your backend API
            const response = await mockApiCall('/api/auth/register', { 
                username, 
                email, 
                password 
            });
            
            if (response.success) {
                alert('Registration successful! Please login.');
                registerModal.style.display = 'none';
                loginModal.style.display = 'block';
                registerForm.reset();
            } else {
                alert(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    }

    // Mock API call function
    function mockApiCall(endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful response
                if (endpoint.includes('login')) {
                    resolve({
                        success: true,
                        token: 'mock-jwt-token',
                        user: {
                            id: 1,
                            username: data.email.split('@')[0],
                            email: data.email
                        }
                    });
                } else if (endpoint.includes('register')) {
                    resolve({
                        success: true,
                        message: 'User registered successfully'
                    });
                }
            }, 1000);
        });
    }

    // Initialize the application
    init();
});
