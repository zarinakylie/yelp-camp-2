if (document.getElementById('picker-map')) {

    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');

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

    const locationInput = document.getElementById('location');
    const searchBtn = document.getElementById('location-search');

    async function flyToLocation() {
        const q = locationInput.value.trim();
        if (!q) {
            showToast('Type a location first', 'warning');
            return;
        }
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
            );
            const data = await res.json();
            if (data.length) {
                const place = data[0];
                map.setView([parseFloat(place.lat), parseFloat(place.lon)], 13);
                locationInput.value = place.display_name;
                showToast('Found! Now pin the exact spot on the map.', 'success');
            } else {
                showToast('Location not found! Check the spelling.', 'error');
            }
        } catch (err) {
            showToast('Search failed. Try again.', 'error');
        }
    }

    searchBtn.addEventListener('click', flyToLocation);

    locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            flyToLocation();
        }
    });

    document.querySelector('.validated-form').addEventListener('submit', (e) => {
        if (!latInput.value || !lngInput.value) {
            e.preventDefault();
            showToast('Pin the campground location on the map first.', 'error');
            return;
        }
        e.preventDefault();
        showToast('Creating your campground...', 'info');
        setTimeout(() => {
            e.target.submit();
        }, 1500);
    });

}