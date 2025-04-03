const apiUrl = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=23';
const dataContainer = document.getElementById('data-container');
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');

let debounceTimeout;
const DEBOUNCE_DELAY = 30; // Tijd in milliseconden tussen elke invoer (bijv. 30ms)

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
            const searchTerm = searchInput.value.trim().toLowerCase(); // Verwijder onnodige spaties aan het begin en einde van de zoekterm
            if (searchTerm) {
                filteredData = filteredData.filter(record => {
                    // Zorg ervoor dat de velden bestaan voordat we ze vergelijken
                    const workName = record.name_of_the_work ? record.name_of_the_work.toLowerCase() : '';
                    const artistName = record.nom_de_l_artiste ? record.nom_de_l_artiste.toLowerCase() : '';
                    const adresSearch = record.adresse ? record.adresse.toLowerCase() : '';
                    const descriptionSearch = record.explanation ? record.explanation.toLowerCase() : ''

                    return workName.includes(searchTerm) || artistName.includes(searchTerm) || adresSearch.includes(searchTerm) || descriptionSearch.includes(searchTerm);
                });
            }

            // Filteren op type (indien geselecteerd)
            const selectedType = filterType.value;
            if (selectedType !== 'all') {
                filteredData = filteredData.filter(record => {
                    if (selectedType === 'metnaam') {
                        // Filter op kunstwerken die een naam hebben
                        return record.name_of_the_work && record.name_of_the_work.trim() !== '';
                    } else if (selectedType === 'zondernaam') {
                        // Filter op kunstwerken zonder een naam
                        return !record.name_of_the_work || record.name_of_the_work.trim() === '';
                    }
                });
            }


            // Sorteer de resultaten op basis van de geselecteerde sorteermethode
            filteredData = filteredData.sort((a, b) => {
                // Als 'sortBy' op 'date' is ingesteld, sorteren we op jaartal
                if (sortBy.value === 'date') {
                    // Sorteren op jaartal (Null komt onderaan)
                    const yearA = a.annee ? parseInt(a.annee) : Infinity; // Onbekend jaar naar onderen
                    const yearB = b.annee ? parseInt(b.annee) : Infinity;

                    if (yearA !== yearB) return yearA - yearB;
                }

                // Als 'sortBy' op 'title' is ingesteld, sorteren we op titel
                if (sortBy.value === 'title') {
                    // Functie om te controleren of de titel alleen symbolen of leeg is
                    const isEmptyOrSymbol = (str) => !str || /^[^\w]+$/.test(str);  // Reguliere expressie voor alleen symbolen of leeg

                    const titleA = a.name_of_the_work || ''; // Lege naam wordt als lege string behandeld
                    const titleB = b.name_of_the_work || ''; // Lege naam wordt als lege string behandeld

                    // Als een van de titels leeg of symbolen bevat, deze naar beneden verplaatsen
                    if (isEmptyOrSymbol(titleA) && !isEmptyOrSymbol(titleB)) {
                        return 1; // A komt onder B
                    }
                    if (!isEmptyOrSymbol(titleA) && isEmptyOrSymbol(titleB)) {
                        return -1; // B komt onder A
                    }

                    // Als de titels gelijk zijn, sorteren we op naam van de artiest
                    if (titleA === titleB) {
                        const artistA = a.nom_de_l_artiste || '';
                        const artistB = b.nom_de_l_artiste || '';
                        return artistA.localeCompare(artistB);
                    }

                    return titleA.localeCompare(titleB);
                }
                // Sorteer op artiestnaam
                if (sortBy.value === 'artistnaam') {
                    const ArtistA = a.nom_de_l_artiste || '';
                    const ArtisteB = b.nom_de_l_artiste || '';

                    const isEmptyOrSymbol = (str) => !str || /^[^\w]+$/.test(str);

                    if (isEmptyOrSymbol(ArtistA) && !isEmptyOrSymbol(ArtisteB)) {
                        return 1; // A komt onder B
                    }
                    if (!isEmptyOrSymbol(ArtistA) && isEmptyOrSymbol(ArtistA)) {
                        return -1; // B komt onder A
                    }

                    if (ArtistA === ArtisteB) {
                        const artistA = a.name_of_the_work || '';
                        const artistB = b.name_of_the_work || '';
                        return artistA.localeCompare(artistB);
                    }

                    return ArtistA.localeCompare(ArtisteB);

                }

                // Sorteer op artiestnaam
                if (sortBy.value === 'adres') {
                    const AdresA = a.adresse || '';
                    const AdresB = b.adresse || '';

                    const isEmptyOrSymbol = (str) => !str || /^[^\w]+$/.test(str);

                    if (isEmptyOrSymbol(AdresA) && !isEmptyOrSymbol(AdresB)) {
                        return 1; // A komt onder B
                    }
                    if (!isEmptyOrSymbol(AdresA) && isEmptyOrSymbol(AdresB)) {
                        return -1; // B komt onder A
                    }

                    if (AdresA === AdresB) {
                        const AdresA = a.name_of_the_work || '';
                        const AdresB = b.name_of_the_work || '';
                        return AdresA.localeCompare(AdresB);
                    }

                    return AdresA.localeCompare(AdresB);

                }

                return 0;
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
                artistName.innerHTML = `<strong>Artist:</strong> <span class="artist-name">${record.nom_de_l_artiste || 'Onbekend'}</span>`;
                artCard.appendChild(artistName);

                // Beschrijving van het kunstwerk
                const description = document.createElement('p');
                description.innerHTML = `<strong>beschrijving:</strong> <span class="art-beschrijving">${record.explanation || 'Geen beschrijving beschikbaa'}</span>`;
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