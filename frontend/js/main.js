document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display centers
    fetchCenters();
});

// Fetch Centers from Backend
function fetchCenters() {
    fetch('/api/center/all')
        .then(response => response.json())
        .then(data => {
            let centersHTML = '';
            data.forEach(center => {
                centersHTML += `
                    <div class="center-card" data-center-name="${center.name}">
                        <h3>${center.name}</h3>
                        <p>${center.location}</p>
                    </div>
                `;
            });
            document.getElementById('centers').innerHTML = centersHTML;

            // Add click event listeners to each center card
            document.querySelectorAll('.center-card').forEach(card => {
                card.addEventListener('click', function () {
                    const centerName = this.getAttribute('data-center-name');
                    redirectToBooking(centerName);
                });
            });
        })
        .catch(error => console.error('Error fetching centers:', error));
}

// Redirect to the booking page with the center name in the query string
function redirectToBooking(centerName) {
    const encodedCenterName = encodeURIComponent(centerName);
    window.location.href = `center.html?center=${encodedCenterName}`;
}
