# BrusselsExplorer

**BrusselsExplorer** is een interactieve webapplicatie waarmee gebruikers kunstwerken en hun locaties in Brussel kunnen ontdekken. Het biedt een dynamische interface waar gebruikers kunstwerken kunnen verkennen, meer te weten kunnen komen over de locaties van deze kunstwerken, en gemakkelijk kunnen schakelen tussen een licht en donker thema.

---

## Inhoudsopgave

1. [Beschrijving](#beschrijving)
2. [Functies](#functies)
3. [Kenmerken](#belangrijkste_kenmerken)
4. [Installatie](#installatie)
5. [Gebruik](#gebruik)
6. [Bestandsstructuur](#bestandsstructuur)
7. [Auteurs](#auteurs)

---

## Beschrijving

**BrusselsExplorer** biedt gebruikers een overzicht van de mooiste kunstwerken en hun specifieke locaties in Brussel. De applicatie maakt gebruik van moderne webtechnologieën zoals HTML, CSS en JavaScript (ES Modules) om een dynamische gebruikerservaring te bieden.

### Belangrijkste_Kenmerken:
- **Overzicht van kunstwerken**: Gebruikers kunnen de mooiste kunstwerken van Brussel ontdekken.
- **Locatie-informatie**: Per kunstwerk kunnen gebruikers de locatie in de stad raadplegen.
- **Thema-schakelaar**: Gebruikers kunnen schakelen tussen een licht en donker thema voor een betere gebruikerservaring.

---

## Functies

- **Lijst van kunstwerken**: Dynamische weergave van kunstwerken en hun locaties op de kaart van Brussel.
- **Schakel tussen lichte en donkere thema's**: De applicatie biedt een knop waarmee gebruikers kunnen schakelen tussen thema's, afhankelijk van hun voorkeur.
- **Dynamisch laden van gegevens**: Gegevens over kunstwerken worden dynamisch geladen vanuit een externe API (de URL is te configureren in de JavaScript-bestanden).
- **Gebruiksvriendelijke interface**: Een eenvoudige en intuïtieve interface voor alle gebruikers, ongeacht hun technische ervaring.

---

## Installatie

Volg de onderstaande stappen om de applicatie lokaal op je computer te draaien:

**Voorwaarden**
Zorg ervoor dat je de volgende software hebt geïnstalleerd:
- **Een moderne webbrowser** zoals Google Chrome, Mozilla Firefox, Safari of Microsoft Edge.
- **Texteditor**: Om de code te kunnen bewerken, kun je een texteditor zoals [VS Code](https://code.visualstudio.com/) gebruiken.

**Stappen om het project lokaal te draaien**:

1. **Download of Clone het Project**:
   - Klik op de groene **"Code"** knop bovenaan deze pagina op GitHub.
   - Kies **"Download ZIP"** om het bestand naar je computer te downloaden.
   - Of, als je Git hebt geïnstalleerd, gebruik je het volgende commando om het project te klonen:
     ```bash
     git clone https://github.com/jouwgebruikersnaam/brussels-explorer.git
     ```

2. **Bestanden openen**:
   - Open de gedownloade map in je favoriete texteditor (bijv. VS Code).
   - De map bevat de volgende hoofdbestanden:
     - `index.html` (Hoofdpagina)
     - `Locatie.html` (Locatiepagina)
     - `Script.mjs` (JavaScript-bestand voor de dynamische inhoud)
     - `Layout.css` (CSS-bestand voor de opmaak)
   
3. **Bestanden in je browser openen**:
   - Open het `index.html` bestand in je webbrowser door erop te dubbelklikken.
   - Je zou nu de hoofdpagina van het project moeten zien, met de mogelijkheid om door de kunstwerken en locaties in Brussel te navigeren.

4. **(Optioneel) Lokale server draaien**:
   - Als je de applicatie wilt draaien met een lokale server (bijvoorbeeld om CORS- of API-gerelateerde issues te vermijden), kun je een eenvoudige server draaien met bijvoorbeeld [Live Server extension in VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
   - Installeer de extensie en klik met de rechtermuisknop op `index.html` en selecteer "Open with Live Server".

**API Key (indien van toepassing)**:
- Als je gebruik maakt van een externe API om kunstwerken en locaties op te halen, zorg ervoor dat je een geldige API-sleutel hebt en voeg deze toe aan je projectbestand (`Script.mjs` of een andere configuratie).
- Volg de documentatie van de gebruikte API om te leren hoe je een API-sleutel kunt verkrijgen en configureren.

**Problemen en Oplossingen**
- Als je problemen ondervindt bij het openen van de bestanden, controleer dan of je de juiste bestandsstructuur hebt en of je een compatibele webbrowser gebruikt.
- Als de dynamische inhoud niet laadt, controleer dan of je internetverbinding actief is en of je JavaScript goed werkt in je browser.

---

Voor verdere hulp, kun je de [Issues-pagina op GitHub](https://github.com/jouwgebruikersnaam/brussels-explorer/issues) raadplegen.


---


## Gebruik

1. **Navigeren naar de Hoofdpagina**: Open `index.html` in je browser om een overzicht van de kunstwerken in Brussel te bekijken.
   - De hoofdpagina biedt een introductie van het project en een overzicht van kunstwerken en hun locaties in Brussel.
   
2. **Locaties Bekijken**: Klik op een kunstwerk om gedetailleerde informatie te bekijken over de locatie van het kunstwerk. De pagina zal meer context geven, zoals de naam van het kunstwerk en de specifieke locatie binnen Brussel.

3. **Schakel het Thema**: Aan de bovenkant van de pagina bevindt zich een knop "Schakel naar Donker Thema" waarmee je eenvoudig kunt wisselen tussen een licht en donker thema voor een verbeterde visuele ervaring.
   - De knop past het kleurenschema van de pagina aan, zodat het gemakkelijker wordt om te navigeren in verschillende lichtomstandigheden.
   
4. **Dynamische Data**: De gegevens over kunstwerken en hun locaties worden dynamisch geladen van een externe API. Dit betekent dat de applicatie altijd up-to-date is met de laatste informatie zonder dat handmatige updates nodig zijn.

5. **Verken Verschillende Pagina's**: Naast de hoofdpagina (`index.html`), kun je ook de pagina `Locatie.html` openen om meer gedetailleerde    informatie over specifieke locaties en kunstwerken in Brussel te bekijken.

6. **Gebruik in Verschillende Omgevingen**: De applicatie is volledig responsief, wat betekent dat het goed werkt op zowel desktop- als mobiele apparaten. Dit maakt het makkelijk om kunstwerken te ontdekken, waar je ook bent.


Bij vragen of problemen, raadpleeg de [Issues-pagina](https://github.com/jouwgebruikersnaam/brussels-explorer/issues) op GitHub.

---

## Bestandsstructuur
brussels-explorer/
├── index.html          # Hoofdpagina met een overzicht van de kunstwerken
├── Locatie.html        # Pagina met gedetailleerde informatie over kunstwerken
├── Layout.css          # CSS-bestand voor de styling van de applicatie
├── Script.mjs          # JavaScript-bestand voor dynamische weergave en data-ophaling
└── README.md           # Dit bestand

---

## Auteurs
**HTML / CSS**: Kimberley Thill - Verantwoordelijk voor het ontwerpen en ontwikkelen van de structuur en stijl van de webpagina's, inclusief de opmaak en lay-out van de elementen.

**JavaScript**: Ludger Cardoso - Verantwoordelijk voor de dynamische functionaliteit van de webapplicatie, zoals het laden van gegevens en het implementeren van de thema-schakelaar, filters, etc...
