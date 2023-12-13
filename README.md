# Budjettisovellus

Aloitus 9.11.2023
Aikaa käytetty yhteensä: 64h

Linkki julkaistuun harjoitustyöhön: https://budjetti-front.onrender.com/

[Raportti](https://gitlab.labranet.jamk.fi/AD0924/budjetti/-/blob/main/budjetti-dokumentaatio.pdf)

Päiväkirja

9.11. MondoDB:hen tuntitehtäviä varten tehdyn DemoClusterin alle database "Budjettisovellus" ja sen alle collection "transactions" tuloille ja menoille. Npm init- komennolla aloitetaan sovelluksen luonti, asennettaan (npm install) node, express, mongoose ja cors. Luotu schemat ja niitä käyttävät mallit, jotka vastaavat MongoDB:hen luotuja dokumentteja.
MongoDB- tietokanta yhdistetty index.js- tiedostoon. Kopioin pohjan Harjoitukset8- materiaalista. Tehty post.rest- tiedosto ja testattu tietojen lisäämistä tietokantaa, mikä onnistui! Lisäksi testattu, että tiedot päivittyivät index.html- sivulle. Aikaa käytetty 5h.

11.11. Muutoksia suunnitelmiin. En saanut tallentamaan "Budjettisovellus"-tietokantaan enkä muutettua sitä primary tietokannaksi, joten tällä hetkellä tallennukset menee test- tietokannan alle. (En uskaltanut poistaa test-tietokantaa, kun olen käyttänyt sitä osassa harjoitustehtävistä). Tein funktio(?) calculateNetIncome, jolla käyttäjän syöttämän bruttotulon ja veroprosentin perusteella lasketaan nettotulo omaan kenttäänsä. 4h

13.11. Taistelua päivämäärän kanssa. MungoDB haluaa tallentaa päivämäärän muodossa esim. 2009-09-09T00:00:00.000Z ja jostain syystä muuttaa antamani päivämäärän aina kuukaudella taaksepäin. Kategoria ei tulojen tapauksessa tallennu oikein, lisäsin sen vasta nyt, joten todennäköisesti jotain on unohtunut laittaa tai tietokanta kettuilee. 3h

14.11. Kuin taikaiskusta tänään kun käynnistin kaiken uudelleen, tulojen kategoriat tallentuvat oikein eli vaati vissiin vain uudelleen käynnistyksen, vaikka eilen tämän kanssa kamppailin kauan. Päivämääräkään ei enää heitä kuukaudella syöttämästäni päivämäärästä. Nyt käyttäjä voi kuitenkin syöttää päivämäärän muodossa DD-MM-YYYY ja se tallentuu oikein. Lisäsin tulojen kategorioille pudotusvalikon, josta valita jokin valmiiksi annetuista kategorioista. Tämä toivon mukaan helpottaa myöhemmin tulojen etsimistä kategorian avulla. Ulkonäön muokkaamista, yms. 5h

23.11. Hakukenttien tekoa, tässäkin sai tuskailla aika kauan, että sai hakutulosten suodatuksen toimimaan oikein. Tällä hetkellä hakutulokset toimivat tulojen suhteen. Hakukenttä toimii nyt siten, että käyttäjä voi valita kategorian ja päivämäärän (YYYY-MM), joiden perusteella tietokantaan tallennetut tulot näytetään. Käyttäjä voi myös jättää kategorian valitsematta, jolloin näytetään kaikki käyttäjän valitseman kuukauden tulot. Seuraavalla kerralla paneudun siihen, että saan ne toimimaan myös maksuille. Lisäksi keskityn ensi kerralla ulkoasun muokkaukseen. 5h 

29.11. Hakukentät saatu toimimaan myös menojen osalta. Poistettu turhia/toistuvia osia koodista. Firefox antaa erroreita, mutta muut selaimet eivät, joten taidan luovuttaa ainakin toistaiseksi Firefoxin osalta, kun se ei kerta halua tehdä yhteistyötä, kun muut selaimet tekevät. Ulkoasun editointia. 3h

01.12. Aloitettu edit- ja delete-painikkeiden lisääminen. Tässä tuli vastaan hieman ongelmia, joten en vielä saanut loppuun. Lisäksi muokattu sitä, miten tulot ja menot näytetään käyttäjälle, li-elementit muutettu card:eiksi. Selvittelin sovelluksen julkaisemista, miten se toimii. En ole vielä saanut toimimaan. 3h

02.12. Koodin siistimistä. Nyt päivämäärät näkyvät käyttäjälle haluamallani tavalla. Aloitin harjoitustyön dokumentaation kirjoittamisen ja tein MySQL Workbenchillä yksinkertaisen EER-kaavion dokumentaatiota varten. 3h

04.12. Koodin siistimistä, ylimääräisiä pois. Edit-painike toimii tuloille. Menot pitää vielä korjailla. 8h

05.12. Muokattu tulo näytetään nyt käyttäjälle oikein. Korjaillaan koodia menojan osalta. 4h

06.12. Editoinnit ja poistot toimii nyt kunnolla, muutettu järjestystä, jossa tulot ja menot näytetään. Aluksi tietojen editointi ei taas jostain syystä toiminut, mutta sain sen korjattua. En enää edes muista mitä muutin, jokin pieni asia siinä pisti hanttiin. Metodit korjattu menojen osalta, kaikki toimii nyt. Saa nähdä miten huomenna. 6h

07.12. Muutettu ulkoasun väritystä ja elementtien muotoiluja ja sijainteja, lisätty error-viestit. 3h

8.12. Error-viestit toimii oikein, viimein. Muotoiltu koodia selkeämmäksi, lisätty funktioita error-viestejä varten. 3h

11.12. Lisätty kommentit. Error-viestit toimii nyt myös maksujen ja niiden hakemisen osalta. Julkaisu tehty, koodia muokkailtu julkaisun onnistumiseksi. Vähän pisti vastaan, muttei pahemmin! Raportin kirjoittamista. 7h

13.12. Koodin ja kommenttien siistimistä, kommenttien täydennystä. Raportti loppuun! 5h
