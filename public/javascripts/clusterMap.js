const map = L.map('cluster-map').setView([39.5, -98.35], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const markers = L.markerClusterGroup();

for (const campground of campgrounds.features) {
  const [lng, lat] = campground.geometry.coordinates;
  const marker = L.marker([lat, lng]);
  marker.bindPopup(
    `<a href="/campgrounds/${campground._id}">${campground.title}</a><p>${campground.location}</p>`
  );
  markers.addLayer(marker);
}

map.addLayer(markers);