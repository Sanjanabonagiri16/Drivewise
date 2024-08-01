document.addEventListener('DOMContentLoaded', () => {
    const schoolSelect = document.getElementById('schoolSelect');
    const availableSlots = document.getElementById('availableSlots');
    const loading = document.getElementById('loading');
    const noSlots = document.getElementById('noSlots');

    // Load driving schools
    fetch('/api/driving-schools')
        .then(response => response.json())
        .then(data => {
            data.forEach(school => {
                const option = document.createElement('option');
                option.value = school.id;
                option.textContent = school.name;
                schoolSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading driving schools:', error));

    schoolSelect.addEventListener('change', function() {
        const schoolId = this.value;

        if (schoolId) {
            loading.style.display = 'flex';
            noSlots.classList.add('hidden');
            availableSlots.innerHTML = ''; // Clear previous slots

            // Fetch available slots for the selected school
            fetch(`/api/driving-schools/${schoolId}/slots`)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        noSlots.classList.remove('hidden');
                    } else {
                        data.forEach(slot => {
                            const slotCard = document.createElement('div');
                            slotCard.className = 'card bg-white p-4 rounded-lg shadow-md hover:shadow-lg';
                            slotCard.innerHTML = `
                                <h2 class="font-semibold text-lg">${slot.date} at ${slot.time}</h2>
                                <p class="text-gray-600">Instructor: ${slot.instructor}</p>
                                <button class="bg-blue-500 text-white rounded-lg px-4 py-2 mt-2" onclick="bookSlot(${slot.id})">Book Now</button>
                            `;
                            availableSlots.appendChild(slotCard);
                        });
                    }
                    loading.style.display = 'none';
                })
                .catch(error => {
                    console.error('Error fetching slots:', error);
                    loading.style.display = 'none';
                });
        } else {
            availableSlots.innerHTML = '';
        }
    });
});

function bookSlot(slotId) {
    // Logic to handle booking a slot
    alert(`Slot ${slotId} booked successfully!`);
}
