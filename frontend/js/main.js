// Global variables
let currentPage = 1;
const resultsPerPage = 6; // Number of results per page

// Initialize Leaflet map
const map = L.map('map').setView([51.505, -0.09], 13); // Default to some location

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Event listeners for search functionality
document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Function to get the user's location
function getUserLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            callback(position.coords.latitude, position.coords.longitude);
        }, () => {
            alert("Unable to retrieve your location. Please enter it manually.");
            callback(null, null); // Call with null values if location retrieval fails
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        callback(null, null); // Call with null values if geolocation is not supported
    }
}

// Function to perform the search
function performSearch() {
    const location = encodeURIComponent(document.getElementById('search').value);
    const rating = encodeURIComponent(document.getElementById('rating').value);
    const price = encodeURIComponent(document.getElementById('price').value);
    const sortBy = encodeURIComponent(document.getElementById('sortBy').value);

    // Show loading indicator
    document.getElementById('loading').classList.remove('hidden');

    getUserLocation((latitude, longitude) => {
        const query = `/api/driving-schools?location=${location}&rating=${rating}&price=${price}&latitude=${latitude}&longitude=${longitude}&sortBy=${sortBy}&page=${currentPage}&limit=${resultsPerPage}`;

        fetch(query)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const schoolList = document.getElementById('schoolList');
                schoolList.innerHTML = ''; // Clear previous results

                // Clear existing markers
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Create cards for each driving school
                data.schools.forEach(school => {
                    const schoolCard = document.createElement('div');
                    schoolCard.className = 'card bg-white p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg';
                    schoolCard.innerHTML = `
                        <h2 class="font-bold text-xl mb-2">${school.name}</h2>
                        <p>Location: ${school.location}</p>
                        <p>Rating: ${school.rating} ⭐</p>
                        <p>Price: $${school.price}</p>
                        <p>Distance: ${school.distance ? school.distance.toFixed(2) : 'N/A'} km</p>
                        <button class="bg-blue-600 text-white rounded-lg px-4 py-2 mt-2" onclick="viewProfile(${school.id})">View Profile</button>
                    `;
                    schoolList.appendChild(schoolCard);

                    // Add marker to map
                    L.marker([school.latitude, school.longitude])
                        .addTo(map)
                        .bindPopup(`<b>${school.name}</b><br>${school.location}<br>Rating: ${school.rating} stars`)
                        .openPopup();
                });

                // Update pagination info
                document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${data.totalPages}`;
                document.getElementById('prevPage').disabled = currentPage === 1;
                document.getElementById('nextPage').disabled = currentPage === data.totalPages;

                // Hide loading indicator
                document.getElementById('loading').classList.add('hidden');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('loading').classList.add('hidden');
                alert('An error occurred while fetching the driving schools. Please try again later.');
            });
    });
}

// Event listeners for pagination
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        performSearch();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    performSearch();
});

// Function to view the profile of a selected driving school
function viewProfile(id) {
    window.location.href = `school-profile.html?id=${id}`;
}

// Handle payment button click (Ensure this button is present in your HTML)
document.getElementById('pay-button')?.addEventListener('click', function(event) {
    const amount = document.getElementById('amount').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Validate amount
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        event.preventDefault(); // Prevent form submission
        return;
    }

    // Validate payment method
    if (!paymentMethod) {
        alert('Please select a payment method.');
        event.preventDefault(); // Prevent form submission
        return;
    }

    // Proceed with payment processing
});

// Handle registration form submission
document.getElementById('registrationForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred during registration. Please try again.');
    }
});

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            window.location.href = result.user.role === 'instructor' ? '/instructor-dashboard.html' : '/client-dashboard.html';
        } else {
            document.getElementById('errorMessage').textContent = result.message;
            document.getElementById('errorMessage').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred during login. Please try again.';
        document.getElementById('errorMessage').classList.remove('hidden');
    }
});
