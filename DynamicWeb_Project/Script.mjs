// Declareer de DOM-elementen bovenaan
const apiUrl = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=23';
const dataContainer = document.getElementById('data-container');
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');

// Haal en toon de kunstwerken
async function fetchAndDisplayArtworks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Netwerkprobleem of ongeldige API-antwoord');
        }
        const data = await response.json();

        // Leeg de data-container voordat we nieuwe items invoegen
        dataContainer.innerHTML = '';

        if (data && data.results) {
            // Voor elke record, maak een art-card en voeg deze toe aan de container
            data.results.forEach(record => {
                const artCard = document.createElement('section');
                artCard.classList.add('art-card');

                // Titel van het kunstwerk
                const title = document.createElement('h3');
                title.textContent = record.name_of_the_work || 'Onbekend';
                artCard.appendChild(title);

                // Naam van de artiest
                const artistName = document.createElement('p');
                artistName.innerHTML = `Artist: <span class="artist-name">${record.nom_de_l_artiste || 'Onbekend'}</span>`;
                artCard.appendChild(artistName);

               // Beschrijving van het kunstwerk
                const description = document.createElement('p');
                description.textContent = record.explanation || 'Geen beschrijving beschikbaar';
                artCard.appendChild(description);

                // Jaar van het kunstwerk
                const year = document.createElement('p');
                year.innerHTML = `<strong>Jaar:</strong> <span class="art-date">${record.annee || 'Onbekend'}</span>`;
                artCard.appendChild(year);

                // Favorieten knop
                const favoriteButton = document.createElement('button');
                favoriteButton.classList.add('favorite-btn');
                favoriteButton.textContent = 'Voeg toe aan favorieten';
                favoriteButton.dataset.artworkId = record.recordid; // Zet een ID op de knop voor verdere verwerking
                artCard.appendChild(favoriteButton);

                // Voeg de art-card toe aan de container
                dataContainer.appendChild(artCard);
            });
        } else {
            dataContainer.innerHTML = '<p>Geen records gevonden</p>';
        }
    } catch (error) {
        console.error('Er is iets mis gegaan:', error);
        dataContainer.innerHTML = '<p>Er is iets mis gegaan bij het laden van de data.</p>';
    }
}

// Filteren en sorteren op zoekopdracht en selecties
searchInput.addEventListener('input', fetchAndDisplayArtworks);
filterType.addEventListener('change', fetchAndDisplayArtworks);
sortBy.addEventListener('change', fetchAndDisplayArtworks);

// Roep de functie aan bij het laden van de pagina
fetchAndDisplayArtworks();

// Favorieten knop klik event
favoriteButton.addEventListener('click', function () {
    // Verkrijg de specifieke gegevens van het kunstwerk
    const artwork = {
        title: record.name_of_the_work || 'Onbekend',
        artist: record.nom_de_l_artiste || 'Onbekend',
        description: record.explanation || 'Geen beschrijving beschikbaar',
        year: record.annee || 'Onbekend',
        recordId: record.recordid
    };

    // Verkrijg de huidige lijst van favorieten uit localStorage, of maak een nieuwe array als deze nog niet bestaat
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Voeg het kunstwerk toe aan de favorietenlijst
    favorites.push(artwork);

    // Sla de bijgewerkte lijst op in localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Stuur de gebruiker naar de Favorietenpagina
    window.location.href = 'Favoriet.html';
});
