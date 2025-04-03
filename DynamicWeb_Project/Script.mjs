const apiUrl = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/streetart/records?limit=23';
const dataContainer = document.getElementById('data-container');
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');


const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const languageSelect = document.getElementById('language-select'); // Taalselectie
const translations = {
    nl: {
        themeButtonDark: 'Schakel naar Licht Thema',
        themeButtonLight: 'Schakel naar Donker Thema',
        home: 'Home',
        location: 'Locatie',
        favorites: 'Favoriet',
        intro: 'Hier zie je de kunstwerken die je hebt gekozen als favorieten!'
    },
    en: {
        themeButtonDark: 'Switch to Light Theme',
        themeButtonLight: 'Switch to Dark Theme',
        home: 'Home',
        location: 'Location',
        favorites: 'Favorites',
        intro: 'Here are the artworks you have chosen as favorites!'
    },
    fr: {
        themeButtonDark: 'Passer au thème clair',
        themeButtonLight: 'Passer au thème sombre',
        home: 'Accueil',
        location: 'Lieu',
        favorites: 'Favoris',
        intro: 'Voici les œuvres d\'art que vous avez choisies comme favoris!'
    }
};

// Functie om de taal in te stellen
function setLanguage(language) {
    localStorage.setItem('language', language);  // Sla de taal op in localStorage
    document.querySelector('h2').textContent = translations[language].intro;
    themeToggle.textContent = body.classList.contains('dark-theme')
        ? translations[language].themeButtonDark
        : translations[language].themeButtonLight;
    document.querySelector('a[href="Index.html"]').textContent = translations[language].home;
    document.querySelector('a[href="Locatie.html"]').textContent = translations[language].location;
    document.querySelector('a[href="Favoriet.html"]').textContent = translations[language].favorites;
}

// Laad de opgeslagen taal als deze er is
const savedLanguage = localStorage.getItem('language') || 'nl';  // Standaard Nederlands
languageSelect.value = savedLanguage;
setLanguage(savedLanguage);

// Wanneer de taal wordt gewijzigd, pas de inhoud aan
languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
});

// Functie om het thema te wisselen
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const currentLanguage = localStorage.getItem('language') || 'nl';
    themeToggle.textContent = body.classList.contains('dark-theme')
        ? translations[currentLanguage].themeButtonDark
        : translations[currentLanguage].themeButtonLight;
});



let debounceTimeout;
const DEBOUNCE_DELAY = 30; // Tijd in milliseconden tussen elke invoer (bijv. 30ms)

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

                const translations = {
                    nl: {
                        artist: 'Artiest',
                        description: 'Beschrijving',
                        address: 'Adres',
                        year: 'Jaar',
                        addFavorite: 'Voeg toe aan favorieten',
                        removeFavorite: 'Verwijder uit favorieten',
                        unknown: 'Onbekend'
                    },
                    en: {
                        artist: 'Artist',
                        description: 'Description',
                        address: 'Address',
                        year: 'Year',
                        addFavorite: 'Add to favorites',
                        removeFavorite: 'Remove from favorites',
                        unknown: 'Unknown'
                    },
                    fr: {
                        artist: 'Artiste',
                        description: 'Description',
                        address: 'Adresse',
                        year: 'Année',
                        addFavorite: 'Ajouter aux favoris',
                        removeFavorite: 'Retirer des favoris',
                        unknown: 'Inconnu'
                    }
                };


                // Verkrijg de geselecteerde taal
                const currentLanguage = localStorage.getItem('language') || 'nl';  // Standaard Nederlands

                // Functie om te controleren of een kunstwerk in de favorieten staat
                function isFavorite(artworkId) {
                    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    return favorites.includes(artworkId);
                }

               // Functie om een kunstwerk toe te voegen of te verwijderen uit de favorieten
                function toggleFavorite(artworkId) {
                    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

                    if (favorites.includes(artworkId)) {
                        // Verwijder het kunstwerk uit de favorieten
                        favorites = favorites.filter(id => id !== artworkId);
                    } else {
                        // Voeg het kunstwerk toe aan de favorieten
                        favorites.push(artworkId);
                    }

                    // Sla de favorieten op in localStorage
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                }

                // Voor elke record, maak een art-card en voeg deze toe aan de container
                filteredData.forEach(record => {
                    const artCard = document.createElement('section');
                    artCard.classList.add('art-card');

                    // Controleer of er een afbeelding beschikbaar is en voeg deze toe
                    if (record.photo && record.photo.url) {
                        const image = document.createElement('img');
                        image.src = record.photo.url;
                        image.alt = record.name_of_the_work || translations[currentLanguage].unknown;  // Vertaal 'Onbekend'
                        image.classList.add('art-image');
                        artCard.appendChild(image);
                    }

                    // Titel van het kunstwerk
                    const title = document.createElement('h3');
                    title.textContent = record.name_of_the_work || translations[currentLanguage].unknown;  // Vertaal 'Onbekend'
                    artCard.appendChild(title);

                    // Naam van de artiest
                    const artistName = document.createElement('p');
                    artistName.innerHTML = `<strong>${translations[currentLanguage].artist}:</strong> <span class="artist-name">${record.nom_de_l_artiste || translations[currentLanguage].unknown}</span>`; // Vertaal 'Onbekend'
                    artCard.appendChild(artistName);

                    // Beschrijving van het kunstwerk
                    const description = document.createElement('p');
                    description.innerHTML = `<strong>${translations[currentLanguage].description}:</strong> <span class="art-beschrijving">${record.explanation || translations[currentLanguage].unknown}</span>`; // Vertaal 'Onbekend'
                    artCard.appendChild(description);

                    // Locatie van het kunstwerk
                    const location = document.createElement('p');
                    location.innerHTML = `<strong>${translations[currentLanguage].address}:</strong> <span class="art-location">${record.adresse || translations[currentLanguage].unknown}</span>`; // Vertaal 'Onbekend'
                    artCard.appendChild(location);

                    // Jaar van het kunstwerk
                    const year = document.createElement('p');
                    year.innerHTML = `<strong>${translations[currentLanguage].year}:</strong> <span class="art-date">${record.annee || translations[currentLanguage].unknown}</span>`; // Vertaal 'Onbekend'
                    artCard.appendChild(year);

                    // Favorieten knop
                    const favoriteButton = document.createElement('button');
                    favoriteButton.classList.add('favorite-btn');

                    // Zet de tekst van de knop op basis van of het kunstwerk al een favoriet is
                    if (isFavorite(record.recordid)) {
                        favoriteButton.textContent = translations[currentLanguage].removeFavorite || 'Verwijder uit favorieten';
                    } else {
                        favoriteButton.textContent = translations[currentLanguage].addFavorite || 'Voeg toe aan favorieten';
                    }

                    favoriteButton.dataset.artworkId = record.recordid; // Zet een ID op de knop voor verdere verwerking

                    // Voeg een event listener toe om de favorieten status te toggelen
                    favoriteButton.addEventListener('click', () => {
                        toggleFavorite(record.recordid);

                        // Werk de tekst van de knop bij na het toevoegen/verwijderen
                        if (isFavorite(record.recordid)) {
                            favoriteButton.textContent = translations[currentLanguage].removeFavorite || 'Verwijder uit favorieten';
                        } else {
                            favoriteButton.textContent = translations[currentLanguage].addFavorite || 'Voeg toe aan favorieten';
                        }
                    });

                    artCard.appendChild(favoriteButton);

                    // Voeg de art-card toe aan de container
                    dataContainer.appendChild(artCard);
                });


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