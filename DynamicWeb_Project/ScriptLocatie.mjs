// API URL voor kunstwerken
const apiUrl = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=23';

document.addEventListener('DOMContentLoaded', () => {
    // Selecteer de toggle knop en het body-element
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Functie om het thema te wisselen
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        // Pas de tekst van de knop aan afhankelijk van het thema
        if (body.classList.contains('dark-theme')) {
            themeToggle.textContent = 'Schakel naar Licht Thema';
        } else {
            themeToggle.textContent = 'Schakel naar Donker Thema';
        }
    });
});

// De kaart initialiseren met Leaflet.js
const map = L.map('map').setView([50.8503, 4.3517], 13); // Standaard voor Brussel

// Voeg een OpenStreetMap-tegel toe aan de kaart
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Haal en toon de kunstwerken op de kaart
async function fetchAndDisplayArtworks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Netwerkprobleem of ongeldige API-antwoord');
    }
    const data = await response.json();

    
    // Loop door de kunstwerken en zet een marker voor elke locatie
    if (data && data.results) {
      data.results.forEach(record => {
        const location = record.adresse // Gebruik de juiste locatie
        const artworkName = record.name_of_the_work || 'Onbekend Kunstwerk';
        const artistName = record.nom_de_l_artiste || 'Onbekend';
        const photoUrl = record.photo ? record.photo.url : null;
        const latitude = record.geocoordinates.lat;  // Gebruik lat en lon in plaats van geocoordinates[1] en geocoordinates[0]
        const longitude = record.geocoordinates.lon;

        // Debug: Controleer of de coördinaten correct zijn
        console.log(`Kunstwerk: ${artworkName}, Locatie: ${latitude}, ${longitude}`);

        // Maak een popup-inhoud
        let popupContent = `<strong>${artworkName}</strong><br>`;
        popupContent += `<strong>Artist:</strong> ${artistName}<br>`;
        popupContent += `<strong>Adres:</strong> ${location}<br>`;
        if (photoUrl) {
          popupContent += `<img src="${photoUrl}" alt="${artworkName}" style="width:100px; height:auto;"/>`;
        }

        // Zet de marker en de popup op de kaart
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(popupContent);

        // Voeg de marker toe met een kleine popup die verschijnt bij muisbeweging
        marker.on('mouseover', () => {
          marker.openPopup();
        });
      });
    }
  } catch (error) {
    console.error('Er is iets mis gegaan:', error);
  }
}

// Functie om de huidige locatie van de gebruiker te tonen op de kaart
function showUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      // Zet een marker voor de huidige locatie van de gebruiker
      L.marker([userLat, userLon]).addTo(map)
        .bindPopup('Jouw Locatie')
        .openPopup();

      // Verplaats de kaart naar de locatie van de gebruiker
      map.setView([userLat, userLon], 13);
    }, () => {
      alert("Locatie kon niet worden gevonden.");
    });
  } else {
    alert("Geolocatie wordt niet ondersteund door deze browser.");
  }
}

// Haal de kunstwerken op en toon ze op de kaart
fetchAndDisplayArtworks();

// Toon de huidige locatie van de gebruiker
showUserLocation();
