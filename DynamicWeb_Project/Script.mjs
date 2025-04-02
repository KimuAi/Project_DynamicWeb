// De container waar we de kunstwerken gaan toevoegen
const dataContainer = document.getElementById('data-container');

// Itereer door de records en maak voor elk kunstwerk een nieuwe HTML-sectie
data.results.forEach(record => {
    const artworkTitle = record.fields.titre; // Titel van het kunstwerk
    const artistName = record.fields.nom_de_l_artiste; // Naam van de artiest
    const description = record.fields.description || 'Geen beschrijving beschikbaar'; // Beschrijving, indien beschikbaar
    const year = record.fields.annee || 'Onbekend'; // Jaar, indien beschikbaar

    // Maak een nieuwe div voor elk kunstwerk
    const artworkCard = document.createElement('section');
    artworkCard.classList.add('art-card');
    
    // Voeg de titel van het kunstwerk toe
    const titleElement = document.createElement('h3');
    titleElement.textContent = artworkTitle;
    artworkCard.appendChild(titleElement);

    // Voeg de naam van de artiest toe
    const artistElement = document.createElement('p');
    artistElement.innerHTML = `Artist: <span class="artist-name">${artistName}</span>`;
    artworkCard.appendChild(artistElement);

    // Voeg de beschrijving toe
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    artworkCard.appendChild(descriptionElement);

    // Voeg het jaar toe
    const yearElement = document.createElement('p');
    yearElement.innerHTML = `<strong>Jaar:</strong> <span class="art-date">${year}</span>`;
    artworkCard.appendChild(yearElement);

    // Voeg een favorietenknop toe
    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-btn');
    favoriteButton.textContent = 'Voeg toe aan favorieten';
    favoriteButton.dataset.artworkId = record.recordid;
    artworkCard.appendChild(favoriteButton);

    // Voeg de kunstwerk sectie toe aan de container
    dataContainer.appendChild(artworkCard);
});
