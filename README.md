# Personal Trainer App

Front End -ohjelmoinnin harjoitustyö.

Harjoitustyö on julkaistu: https://personal-trainer-sovellus.netlify.app/

## Rakenne
- Etusivu
- Asiakkaat
- Harjoitusket
- Kalenteri
- Tilastot

## Tehtävä:

### Osa1
Luo React sovellus, jossa on omat listasivut asiakkaille (customer) ja harjoituksille (training). Luo myös navigaatio, jolla sivujen välillä voi siirtyä.

Listasivujen minimivaatimukset:

- Asiakkaiden ja harjoitusten listaussivut navigaatiolla
- Järjestely ja suodatus
- Päivämäärien muotoilu
- Asiakkaan nimi harjoituslistalla

### Osa2
Lisää seuraavat CRUD toiminnallisuudet asiakas ja harjoitus listasivuille:

- Uuden asiakkaiden lisäys
- Asiakkaan muokkaus ja poisto
- Uuden harjoituksen lisääminen asiakkaalle. Käytä harjoituksen päivämäärän syöttöön jotain siihen soveltuvaa komponenttia
- Harjoituksen poisto

Lisää poistotoimintoihin myös vahvistus käyttäjältä.

### Osa3
- Lisää export toiminnallisuus, jolla käyttäjä voi viedä asiakastiedot CSV tiedostoon. Suodata tiedostosta pois kaikki ylimääräinen tieto (esim. painike sarakkeet)
- Lisää kalenterisivu, jossa näkyy kaikki varatut harjoitukset kalenterissa (viikkonäkymä, kuukausnäkymä, päivänäkymä). Kts. esimerkki kuva.
- Asenna käyttöliittymä valitsemallesi pilvipalvelimelle

### Osa4
Lisää tilastosivu, josta käyttäjä voi nähdä kuvaajassa kuinka paljon eri harjoitustyyppejä (activity) on ajallisesti varattu minuutteina  (esimerkki)

Vinkki:
- Sopiva komponentti kuvaajien esittämiseen on esim. https://github.com/recharts/recharts
- lodash Javascript kirjasto tarjoaa käteviä funktioita taulukoiden käsittelyyn. Sillä voit esim. ryhmitellä ja laskea summia ryhmittäin: groupBy ja sumBy (https://lodash.com/)


