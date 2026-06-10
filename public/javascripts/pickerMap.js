const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');

// If editing, start at existing coords; otherwise default view
const startLat = parseFloat(latInput.value) || 39.5;
const startLng = parseFloat(lngInput.value) || -98.35;
const startZoom = latInput.value ? 13 : 4;

const map = L.map('picker-map').setView([startLat, startLng], startZoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let marker = latInput.value
    ? L.marker([startLat, startLng], { draggable: true }).addTo(map)
    : null;

function setPoint(lat, lng) {
    latInput.value = lat;
    lngInput.value = lng;
    if (!marker) {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', () => {
            const p = marker.getLatLng();
            setPoint(p.lat, p.lng);
        });
    } else {
        marker.setLatLng([lat, lng]);
    }
}

map.on('click', (e) => setPoint(e.latlng.lat, e.latlng.lng));

// Block submit if no pin (hidden inputs skip HTML5 validation)
document.querySelector('.validated-form').addEventListener('submit', (e) => {
    if (!latInput.value || !lngInput.value) {
        e.preventDefault();
        alert('Please pin the campground location on the map.');
    }
});

// --- Auto-fly to typed location ---
const locationInput = document.getElementById('location');
let lastSearched = '';

async function flyToLocation() {
    const q = locationInput.value.trim();
    if (!q || q === lastSearched) return; // skip empty / unchanged
    lastSearched = q;
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        if (data.length) {
            map.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13);
        }
        // silently do nothing if not found — user can still navigate manually
    } catch (err) {
        console.error('Geocoding failed:', err);
    }
}

// Fire when the user leaves the location field…
locationInput.addEventListener('blur', flyToLocation);

// …or presses Enter in it (and stop Enter from submitting the form)
locationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        flyToLocation();
    }
});