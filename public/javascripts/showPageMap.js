const [lng, lat] = campground.geometry.coordinates;

const map = L.map('map').setView([lat, lng], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`<h5>${campground.title}</h5><p>${campground.location}</p>`)
  .openPopup();