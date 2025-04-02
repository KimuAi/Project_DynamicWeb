// Declareer de DOM-elementen bovenaan
const apiUrl = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=23';
const dataContainer = document.getElementById('data-container');
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');

let debounceTimeout;
const DEBOUNCE_DELAY = 300; // Tijd in milliseconden tussen elke invoer (bijv. 300ms)

searchInput.addEventListener('input', () => {
    // Annuleer de vorige timeout als de gebruiker snel typt
    clearTimeout(debounceTimeout);
    
    // Stel een nieuwe timeout in om de functie pas na een bepaalde tijd uit te voeren
    debounceTimeout = setTimeout(() => {
        fetchAndDisplayArtworks(); // Roept de originele functie aan
    }, DEBOUNCE_DELAY);
});

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
            let filteredData = data.results;

            // Filteren op zoekterm (indien ingevoerd)
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(record => 
                    record.name_of_the_work.toLowerCase().includes(searchTerm) ||
                    record.nom_de_l_artiste.toLowerCase().includes(searchTerm)
                );
            }

            // Filteren op type (indien geselecteerd)
            const selectedType = filterType.value;
            if (selectedType !== 'all') {
                filteredData = filteredData.filter(record => record.type_of_art && record.type_of_art.toLowerCase() === selectedType);
            }

            // Sorteer de resultaten
            filteredData = filteredData.sort((a, b) => {
                // Sorteren op jaartal (Null komt onderaan)
                const yearA = a.annee ? parseInt(a.annee) : Infinity; // Onbekend jaar naar onderen
                const yearB = b.annee ? parseInt(b.annee) : Infinity;

                if (yearA !== yearB) return yearA - yearB;

                // Als jaartallen gelijk zijn, sorteren we op titel (lege namen onderaan)
                const titleA = a.name_of_the_work || ''; // Lege naam wordt als lege string behandeld
                const titleB = b.name_of_the_work || '';

                if (titleA === titleB) {
                    // Als de titels gelijk zijn, sorteren we op naam van de artiest
                    const artistA = a.nom_de_l_artiste || '';
                    const artistB = b.nom_de_l_artiste || '';
                    return artistA.localeCompare(artistB);
                }

                return titleA.localeCompare(titleB);
            });

            // Voor elke record, maak een art-card en voeg deze toe aan de container
            filteredData.forEach(record => {
                const artCard = document.createElement('section');
                artCard.classList.add('art-card');

                // Controleer of er een afbeelding beschikbaar is en voeg deze toe
                if (record.photo && record.photo.url) {
                    const image = document.createElement('img');
                    image.src = record.photo.url;
                    image.alt = record.name_of_the_work || 'Onbekend kunstwerk';
                    image.classList.add('art-image');
                    artCard.appendChild(image);
                }

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
                
                // Locatie van het kunstwerk
                const location = document.createElement('p');
                location.innerHTML = `<strong>Adres:</strong> <span class="art-location">${record.adresse || 'Onbekend'}</span>`;
                artCard.appendChild(location);

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

            // Als er geen gefilterde data is
            if (filteredData.length === 0) {
                dataContainer.innerHTML = '<p>Geen resultaten gevonden</p>';
            }
        } else {
            dataContainer.innerHTML = '<p>Geen records gevonden</p>';
        }
    } catch (error) {
        console.error('Er is iets mis gegaan:', error);
        dataContainer.innerHTML = '<p>Er is iets mis gegaan bij het laden van de data.</p>';
    }
}

// Event listeners voor filtering en sorteren
searchInput.addEventListener('input', fetchAndDisplayArtworks); // Filter op zoekterm
filterType.addEventListener('change', fetchAndDisplayArtworks); // Filter op type
sortBy.addEventListener('change', fetchAndDisplayArtworks); // Sorteer de resultaten

// Zorg ervoor dat de kunstwerken standaard worden weergegeven bij het laden van de pagina
fetchAndDisplayArtworks();
