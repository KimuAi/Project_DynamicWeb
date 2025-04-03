//sessionStorage.clear()

//console.log(sessionStorage.getItem(3));
//record = JSON.parse(sessionStorage.getItem(3));
//console.log(JSON.stringify(filteredData.nom_de_l_artiste));

const dataContainer = document.getElementById('data-container');

let id = 0;
let test
do {
   id += 1;
   record = JSON.parse(sessionStorage.getItem(id));
   if (record != null){
   console.log(sessionStorage.getItem(id));
   showFavorites(record, id);}
   //filteredData(record)
}  while (id < 24);

// Voor elke record, maak een art-card en voeg deze toe aan de container
function showFavorites(record, id) {
console.log(id + " entered function")

  if (sessionStorage.getItem(id)) {
    const artCard = document.createElement("section");
    artCard.classList.add("art-card");
    // Controleer of er een afbeelding beschikbaar is en voeg deze toe
    if (record.photo && record.photo.url) {
      const image = document.createElement("img");
      image.src = record.photo.url;
      image.alt = record.name_of_the_work || "Onbekend kunstwerk";
      image.classList.add("art-image");
      artCard.appendChild(image);
    }

    // Titel van het kunstwerk
    const title = document.createElement("h3");
    title.textContent = record.name_of_the_work || "Onbekend";
    artCard.appendChild(title);

    // Naam van de artiest
    const artistName = document.createElement("p");
    artistName.innerHTML = `<strong>Artist:</strong> <span class="artist-name">${
      record.nom_de_l_artiste || "Onbekend"
    }</span>`;
    artCard.appendChild(artistName);

    // Beschrijving van het kunstwerk
    const description = document.createElement("p");
    description.innerHTML = `<strong>beschrijving:</strong> <span class="art-beschrijving">${
      record.explanation || "Geen beschrijving beschikbaa"
    }</span>`;
    artCard.appendChild(description);

    // Locatie van het kunstwerk
    const location = document.createElement("p");
    location.innerHTML = `<strong>Adres:</strong> <span class="art-location">${
      record.adresse || "Onbekend"
    }</span>`;
    artCard.appendChild(location);

    // Jaar van het kunstwerk
    const year = document.createElement("p");
    year.innerHTML = `<strong>Jaar:</strong> <span class="art-date">${
      record.annee || "Onbekend"
    }</span>`;
    artCard.appendChild(year);

        // Favorieten knop
        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-btn");
        if (sessionStorage.getItem(id) != null) {
          favoriteButton.textContent = "Verwijder toe aan favorieten";
          favoriteButton.classList.add("removefav");
        } else {
          favoriteButton.classList.add("addfav");
          favoriteButton.textContent = "Voeg toe aan favorieten";
        }
        favoriteButton.dataset.artworkId = id; // Zet een ID op de knop voor verdere verwerking
        artCard.appendChild(favoriteButton);

    favoriteButton.addEventListener("click", (event) => {
      const artworkidfav = event.target.dataset.artworkId; // Haal het ID van de knop op
      console.log(record + " " + artworkidfav);
      sessionStorage.setItem(artworkidfav, JSON.stringify(record)); // Sla het record op in sessionStorage

      if (favoriteButton.classList.contains("addfav")) {
        sessionStorage.removeItem(artworkidfav); // Verwijder het record uit sessionStorage
        event.target.textContent = "Voeg toe aan favorieten";
        favoriteButton.classList.replace("addfav", "removefav");
      } else {
        sessionStorage.setItem(artworkidfav, JSON.stringify(record)); // Sla het record op in sessionStorage}
        event.target.textContent = "Verwijder toe aan favorieten";
        favoriteButton.classList.replace("removefav", "addfav");
      }
    });
    // Voeg de art-card toe aan de container
    dataContainer.appendChild(artCard);
  }
}
