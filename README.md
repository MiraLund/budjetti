# Budjettisovellus

Toiminnot:
- tulojen lisääminen
- menojen lisääminen
    - menoille eri labelit tms
    - joka kuun lopuksi kuinka paljon rahaa mihinkin asiaan on mennyt
- budjettitavoite
- säästötavoite ?
- raporttien generointi

Aloitus 9.11.2023

Aikaa käytetty kaiken kaikkiaan: 

9.11. MondoDB:hen tuntitehtäviä varten tehdyn DemoClusterin alle database "Budjettisovellus" ja sen alle collection "transactions" tuloille ja menoille. Npm init- komennolla aloitetaan sovelluksen luonti, asennettaan (npm install) node, express, mongoose ja cors. Luotu schemat ja niitä käyttävät mallit, jotka vastaavat MongoDB:hen luotuja dokumentteja.
MongoDB- tietokanta yhdistetty index.js- tiedostoon. Kopioin pohjan Harjoitukset8- materiaalista. Tehty post.rest- tiedosto ja testattu tietojen lisäämistä tietokantaa, mikä onnistui! Lisäksi testattu, että tiedot päivittyivät index.html- sivulle. Aikaa käytetty 5h.

11.11. Muutoksia suunnitelmiin. En saanut tallentamaan "Budjettisovellus"-tietokantaan enkä muutettua sitä primary tietokannaksi, joten tällä hetkellä tallennukset menee test- tietokannan alle. (En uskaltanut poistaa test-tietokantaa, kun olen käyttänyt sitä osassa harjoitustehtävistä). Tein funktio(?) calculateNetIncome, jolla käyttäjän syöttämän bruttotulon ja veroprosentin perusteella lasketaan nettotulo omaan kenttäänsä. 4h

13.11. Taistelua päivämäärän kanssa. MungoDB haluaa tallentaa päivämäärän muodossa esim. 2009-09-09T00:00:00.000Z ja jostain syystä muuttaa antamani päivämäärän aina kuukaudella taaksepäin. Kategoria ei tulojen tapauksessa tallennu oikein, lisäsin sen vasta nyt, joten todennäköisesti jotain on unohtunut laittaa tai tietokanta kettuilee. 3h

14.11. Kuin taikaiskusta tänään kun käynnistin kaiken uudelleen, tulojen kategoriat tallentuvat oikein eli vaati vissiin vain uudelleen käynnistyksen, vaikka eilen tämän kanssa kamppailin kauan. Päivämäärä tallentuu edelleen tietokannan haluamassa muodossa, mutta sentään ei heitä enää kuukaudella syöttämästäni päivämäärästä. Kokeilin niin paljon eri keinoja, etten ole varma auttoiko tämä: const formattedDate = moment(dateValue, 'DD-MM-YYYY').format('YYYY-MM-DD') vai alkoiko tämä vain myös uudelleenkäynnistyksen myötä toimia itsekseen oikein. Nyt käyttäjä voi kuitenkin syöttää päivämäärän muodossa DD-MM-YYYY ja se tallentuu oikein. Lisäsin tulojen kategorioille pudotusvalikon, josta valita jokin valmiiksi annetuista kategorioista. Tämä toivon mukaan helpottaa myöhemmin tulojen etsimistä kategorian avulla. Ulkonäön muokkaamista, yms. 5h

15.11. 



Tehtävät:
Tee lista toiminnoista, joita haluat budjettisovelluksesi sisältävän. 

Tietokantamalli:
Suunnittele MongoDB-tietokantamalli, joka tukee tarpeitasi. Kokoelma "transactions" tuloille ja menoille.

Aloita Backend-kehitys:
Käytä Node.js:ää ja Express.js:ää backendin luomiseen.
Määrittele tarvittavat reitit (endpoints) tulojen ja menojen lisäämiseen, poistamiseen ja hakemiseen tietokannasta.

Yhdistä MongoDB:
Käytä MongoDB-tietokantaa tallentamaan käyttäjän tuloja ja menoja.
Mongoose-kirjasto helpottamaan tietokannan käsittelyä?

Frontend-kehitys:
Käytä Reactia frontendin rakentamiseen.
Luo käyttöliittymä tulojen ja menojen lisäämiseen ja näyttämiseen.

Yhdistä Frontend ja Backend:
Käytä HTTP-pyyntöjä (esim. Axios) yhdistämään frontend ja backend.
Varmista, että tiedot lähetetään oikein backendiin ja päinvastoin.

Käyttäjätilit ja Autentikointi:
Tehdäänkö käyttäjätilit?
Lisää käyttäjien hallinta ja autentikointi, jotta jokainen käyttäjä voi pitää oman budjettinsa.

Budjettitavoitteet ja Raportit:
Lisää mahdollisuus asettaa budjettitavoitteita ja generoida raportteja kulujen ja tulojen kehityksestä.

Testaa Sovellus:
Testaa sovellusta varmistaaksesi, että kaikki toimii odotetusti.

Julkaise Sovellus Herokuun:
Kun sovellus on valmis, voit julkaista sen Herokuun ja antaa muidenkin kokeilla sitä.

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.labranet.jamk.fi/AD0924/budjettisovellus.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.labranet.jamk.fi/AD0924/budjettisovellus/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
