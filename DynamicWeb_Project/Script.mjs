const apiUrl = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=20";

async function fetchStreetArt() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP-fout! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response (parsed):", data);
        displayStreetArt(data.results || []);
    } catch (error) {
        console.error("Fout bij het ophalen van street art gegevens:", error);
    }
}

function displayStreetArt(records) {
    const container = document.getElementById("data-container");
    container.innerHTML = ""; 

    records.forEach(record => {
        const fields = record.fields || {}; // Zorg ervoor dat fields bestaat
        const artElement = document.createElement("section");
        artElement.classList.add("art-card");
        
        artElement.innerHTML = `
            <img src="${fields.image || 'artwork1.jpg'}" alt="${fields.title || 'Onbekend Kunstwerk'}">
            <h3>${fields.title || 'Onbekende Titel'}</h3>
            <p>Artist: <span class="artist-name">${fields.artist || 'Onbekend'}</span></p>
            <p>${fields.description || 'Geen beschrijving beschikbaar.'}</p>
            <p><strong>Jaar:</strong> ${fields.date || 'Onbekend'}</p> <!-- Hier voeg je de datum toe -->
            <button class="favorite-btn" data-artwork-id="${record.id}">Voeg toe aan favorieten</button>
        `;

        container.appendChild(artElement);
    });
}

// Laad de street art gegevens bij het laden van de pagina
document.addEventListener("DOMContentLoaded", fetchStreetArt);

// Event Listener voor de "Laad meer" knop
document.getElementById("load-more-btn").addEventListener("click", fetchStreetArt);