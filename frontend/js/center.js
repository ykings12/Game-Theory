

let selectedSlots = {}; // To track selected slots for each sport
let nameOfCenter = "";

// Function to fetch center details by name
async function fetchCenterDetails(centerName) {
    try {
        const response = await fetch(`/api/center/name/${encodeURIComponent(centerName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const center = await response.json();
        displayCenterDetails(center);
    } catch (error) {
        console.error('Error fetching center details:', error);
        document.getElementById('center-name').innerText = "Center not found.";
    }
}

// Function to display center details
function displayCenterDetails(center) {
    nameOfCenter=center.name;
    document.getElementById('center-name').innerText = center.name;
    document.getElementById('center-image').src = center.image || 'default-image.jpg'; // Update default image if necessary
    document.getElementById('center-description').innerText = center.description || 'No description available.';
    document.getElementById('center-location').innerText = center.location;
    // console.log(center.contact);
    document.getElementById('center-phone').innerText = center.contact.phone || 'N/A';
    document.getElementById('center-email').innerText = center.contact.email || 'N/A';
    document.getElementById('center-amenities').innerText = center.amenities.join(', ') || 'N/A';
    document.getElementById('center-ratings').innerText = center.ratings || '0';

    const sportsList = document.getElementById('sports-list');
    sportsList.innerHTML = ''; // Clear existing sports
    center.sports.forEach(sport => {
        const sportItem = document.createElement('div');
        sportItem.className = 'sport-item';
        sportItem.innerHTML = `
            <h3>${sport.name}</h3>
            <p>Courts: ${sport.courts}</p>
            <h4>Available Slots:</h4>
            <div class="slots">
                ${generateSlotHTML(sport.slots, sport.name)}
            </div>
            <button class="book-button" onclick="bookSlot('${sport.name}')">Book Now</button>
        `;
        sportsList.appendChild(sportItem);
    });

}

// Function to generate HTML for slots with selection handling
function generateSlotHTML(slots, sportName) {
    return slots.map(slot => `
        <div class="slot ${slot.isAvailable ? 'available' : 'unavailable'}" onclick="selectSlot('${sportName}', '${slot.startTime}', '${slot.endTime}', ${slot.isAvailable}, this)" data-sport="${sportName}">
            <span>${slot.startTime} - ${slot.endTime} - ${slot.isAvailable ? 'Available' : 'Booked'}</span>
            ${slot.isAvailable ? '<span class="select-slot"></span>' : ''}
        </div>
    `).join('');
}


// Function to select a slot for booking
// Function to select a slot for booking
function selectSlot(sportName, startTime, endTime, isAvailable, element) {
    if (isAvailable) {
        // Deselect the previously selected slot for the sport
        if (selectedSlots[sportName]) {
            const previousSlotElement = document.querySelector(`.slot.selected[data-sport="${sportName}"]`);
            if (previousSlotElement) {
                previousSlotElement.classList.remove('selected');
                previousSlotElement.style.backgroundColor = ''; // Reset previous slot color
            }
        }
        
        // Select the new slot
        selectedSlots[sportName] = { startTime, endTime };
        element.classList.add('selected');
        element.style.backgroundColor = '#cce5ff'; // Change color to indicate selection
        element.setAttribute('data-sport', sportName); // Store sport name for easy access
    } else {
        // Optionally, you could change the color or style for booked slots
        element.style.backgroundColor = ''; // Reset color if already booked
    }
}


// Function to get center name from URL and fetch details
function getCenterNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('center');
}

// Fetch center details on page load
const centerName = getCenterNameFromURL();
if (centerName) {
    fetchCenterDetails(centerName);
} else {
    console.error('No center name provided in the URL.');
}


// Function to handle booking slots
function bookSlot(sportName) {
    const selectedSlot = selectedSlots[sportName];
    if (selectedSlot) {
        // Show the popup to collect the user's email
        const modal = document.getElementById("popupModal");
        modal.style.display = "flex";

        // Update the modal title to reflect the sport and slot times
        document.querySelector('.modal-content h2').innerText = `Confirm Booking for ${sportName}`;
        document.querySelector('.modal-content p').innerText = `You are booking a slot from ${selectedSlot.startTime} to ${selectedSlot.endTime}. Please enter your email to confirm.`;

        // Handle the booking confirmation after the email is entered
        document.getElementById("bookBtn").onclick = function () {
            const email = document.getElementById("emailInput").value;
            if (email) {
                const bookingDetails = {
                    centerId: nameOfCenter,
                    userEmail: email,
                    date: new Date(), // Booking for the current date (can be customized)
                    sport: sportName,
                    slot: `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                };
    
                // Send a POST request to the server
                fetch('/api/booking/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingDetails)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Booking created successfully.') {
                        alert(`Booking confirmed for ${sportName} slot from ${selectedSlot.startTime} to ${selectedSlot.endTime} for ${email}.`);

                        const updateSlot = {
                            name: nameOfCenter,
                            sportName: sportName,
                            startTime: selectedSlot.startTime,
                            endTime: selectedSlot.endTime
                        };

                        fetch('/api/center/update',{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateSlot)
                        })
                        .then(response=>response.json())
                        .then(updateData => {
                            if (updateData.msg === 'Slot updated successfully') {
                                // Reset the selected slot after booking
                                delete selectedSlots[sportName];

                                // Change the color of the booked slot
                                const bookedSlotElement = document.querySelector(`.slot.selected[data-sport="${sportName}"]`);
                                if (bookedSlotElement) {
                                    bookedSlotElement.style.backgroundColor = '#d4edda'; // Change color to indicate booked
                                }
                            } else {
                                alert('Error updating slot availability.');
                            }
                        })
                        .catch(error => {
                            console.error('Error updating slot availability:', error);
                            alert('Error updating slot availability. Please try again.');
                        });
                        
    
                        // // Reset the selected slot after booking
                        // delete selectedSlots[sportName];
    
                        // // Change the color of the booked slot
                        // const bookedSlotElement = document.querySelector(`.slot.selected[data-sport="${sportName}"]`);
                        // if (bookedSlotElement) {
                        //     bookedSlotElement.style.backgroundColor = '#d4edda'; // Change color to indicate booked
                        // }


                    } else {
                        alert('Error occurred while booking. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error occurred while booking. Please try again.');
                });

                // Close the modal
                closeModal();

            } else {
                alert("Please enter your email to confirm the booking.");
            }
        };
    } else {
        alert(`Please select a time slot for ${sportName} before booking.`);
    }
}


function closeModal() {
    document.getElementById("popupModal").style.display = "none";
    // location.reload();
}

// Attach to existing close, cancel, and book buttons in the popup
document.getElementById("closePopup").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
document.getElementById("bookBtn").addEventListener("click", function () {
    const email = document.getElementById("emailInput").value;
    if (email) {
        // alert(`Booking confirmed for ${email}`);
        closeModal();
    } else {
        alert("Please enter your email to confirm the booking.");
    }
});






