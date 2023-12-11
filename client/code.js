// Luodaan muuttujat, johon tallennetaan kaikki tulot, uudet tulot, kaikki maksut ja uudet maksut
var allIncomes = []
var newIncomes = []
var allPayments = []
var newPayments = []
const siteUrl = 'https://budjetti-back.onrender.com'

function init() {
  console.log('Initializing the application...')
  // Ladataan tulot ja maksut
  loadIncomes()
  loadPayments()

  const incomeInput = document.getElementById('income')
  const taxRateInput = document.getElementById('taxRate')

  // Päivittää netIncomeInput-kentän arvon aina kun incomeInput- tai taxRateInput-kenttään syötetään jotain
  function updateNetIncome() {
    // const incomeInput = document.getElementById('income')
    // const taxRateInput = document.getElementById('taxRate')
    const netIncomeInput = document.getElementById('netIncome')
    const incomeValue = incomeInput.value 
    const taxRateValue = taxRateInput.value 

    // Tämä tyhjentää netIncomeInput kentän aina kun, jompikumpi kentistä (income tai taxRate) on tyhjä
    if (!incomeInput.value || !taxRateInput.value) {
      netIncomeInput.value = ''
      return
    }
  
    // Lasketaan nettotulo ja asetetaan se netIncomeInput-kenttään
    const calculatedNetIncome = calculateNetIncome(incomeValue, taxRateValue)
    netIncomeInput.value = calculatedNetIncome
  }
  

  // Lisätään kuuntelija, joka kutsuu updateNetIncome-funktiota aina kun incomeInput- tai taxRateInput-kenttään syötetään jotain 
  // = Käyttäjä näkee heti syötetyillä arvoilla lasketun nettotulon
  incomeInput.addEventListener('input', updateNetIncome)
  taxRateInput.addEventListener('input', updateNetIncome)

  console.log('Application initialized.')
}

document.addEventListener('DOMContentLoaded', init)

// Funktio, jossa lasketaan nettotulo kahden desimaalin tarkkuudella
function calculateNetIncome(income, taxRate) {
  console.log('Calculating net income:', income, taxRate)
  const netIncome = (income - (income * taxRate / 100)).toFixed(2)
  console.log('Net income:', netIncome)
  return netIncome
}

// Lisätään yleinen kuuntelija errorInputs-kentille, eli jos jokin kentistä on tyhjä, näytetään virheilmoitus
function addInputListeners(form, errorInputs) {
  form.addEventListener('input', function (event) {
    const inputId = event.target.id
    showError(errorInputs.find((input) => input.inputElement.id === inputId))
  })
}

// Funktio tulon lisäämiseksi
async function addIncome() {
  const incomeForm = document.getElementById('incomeForm')
  const incomeValue = incomeForm.income.value
  const netIncomeValue = incomeForm.netIncome.value
  const taxRateValue = incomeForm.taxRate.value
  const incomeCategory = incomeForm.incomeCategory.value
  const dateValue = incomeForm.incomeDate.value

  // Kaikki errorIncomeInputs-kentät, joissa on inputElement, errorElement, errorMessage ja hasError
  // Kaikkien lähtötilanne false
  const errorIncomeInputs = [
    { inputElement: incomeForm.income, errorElement: document.getElementById('errorIncome'), errorMessage: 'Tulo-kenttä ei saa olla tyhjä.', hasError: false },
    { inputElement: incomeForm.taxRate, errorElement: document.getElementById('errorTaxRate'), errorMessage: 'Veroprosentti-kenttä ei saa olla tyhjä.', hasError: false },
    { inputElement: incomeForm.incomeCategory, errorElement: document.getElementById('errorIncomeCategory'), errorMessage: 'Kategoria-kenttä ei saa olla tyhjä.', hasError: false },
    { inputElement: incomeForm.incomeDate, errorElement: document.getElementById('errorIncomeDate'), errorMessage: 'Päivämäärä-kenttä ei saa olla tyhjä.', hasError: false },
  ]
  
  // Asetetaan oletusarvoisesti hasIncomeError epätodeksi, toisin sanoen ei erroreita
  let hasIncomeError = false

  // Näytetään virheilmoitus, jos jokin kentistä on tyhjä
  errorIncomeInputs.forEach((input) => {
    input.errorElement.textContent = input.errorMessage
    showError(input)
  });

  // Jos jokin kentistä on tyhjä, asetetaan hasIncomeError todeksi
  hasIncomeError = errorIncomeInputs.some((input) => input.hasError)
  
  // Jos hasIncomeError on tosi kutsutaan addInputListeners-funktiota, joka näyttää virheilmoituksen
  if (hasIncomeError) {
    addInputListeners(incomeForm, errorIncomeInputs)
    return
  }

// Jos kaikki kentät on oikein täytetty, lisätään tulo tietokantaan POST-metodilla 
try {
    const response = await fetch(siteUrl + '/incomes', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        income: incomeValue,
        netIncome: netIncomeValue,
        taxRate: taxRateValue,
        category: incomeCategory,
        date: dateValue
      })
    })

    if (!response.ok) {
      throw new Error('Server responded with an error')
    }
    const income = await response.json()
    console.log('Income added:', income)
    // Lisätään tulo allIncomes- ja newIncomes-muuttujiin
    allIncomes.push(income)
    newIncomes.push(income)
  } catch (error) {
    console.error('Virhe lisättäessä tuloa:', error.message)
  }
  // Kutsutaan funktiota showIncomes, joka näyttää käyttäjälle lisätyt tulot
  // Kutsutaan funktiota searchIncomes, joka näyttää käyttäjälle hakutulokset
  // Kutsutaan funktiota clearIncomeFields, joka tyhjentää input-kentät
  showIncomes()
  searchIncomes()
  clearIncomeFields()
}

// Funktio, joka näyttää virheilmoituksen, jos kenttä on tyhjä
function showError(errorInput) {
  if (!errorInput) {
    // Jos errorInput on tyhjä, lopeta tässä
    // Näin käy maksun Description-kentän kanssa, koska se ei ole pakollinen eli sille ei ole errorInputia
    return;
  }

  const value = errorInput.inputElement ? errorInput.inputElement.value : null;
  errorInput.hasError = !value;

  if (errorInput.hasError) {
    // Näytetään virheilmoitus
    errorInput.errorElement.style.display = 'block';
  } else {
    // Piilotetaan virheilmoitus
    errorInput.errorElement.style.display = 'none';
  }
}


// Ladataan kaikki tulot tietokannasta, kutsutaan showIncomes-funktiota
async function loadIncomes() {
  try {
    let url = siteUrl + '/incomes';    
    const response = await fetch(url)
    allIncomes = await response.json()
   showIncomes()
  } catch (error) {
    console.error('Error loading incomes:', error)
  }
}

// Funktio, joka näyttää tulot käyttäjälle
function showIncomes(cardContainer = null, filteredIncomes = null) {
  if (!cardContainer) { cardContainer = document.getElementById('incomeCards')}
  cardContainer.innerHTML = ''

  // Jos filteredIncomes on tyhjä, käytetään newIncomes-muuttujaa
  const incomes = filteredIncomes ?? newIncomes
  // Jos tulot-muuttujassa on jotain (sen pituus on isompi kuin 0), käydään läpi jokainen tulo ja luodaan kortti, joka näyttää tulon tiedot
  // Käytetään reverse(), jotta saadaan viimeisin näytettyä ylimmäisenä
  if (incomes.length > 0) {
    incomes.reverse().forEach(income => {
      const card = document.createElement('div')
      card.className = 'card'

      const title = document.createElement('h3')
      title.textContent = `Tulo: ${income.income} | Kategoria: ${income.category}`
      card.appendChild(title)

      const netIncome = document.createElement('p')
      netIncome.textContent = `Nettotulo: ${income.netIncome}`
      card.appendChild(netIncome)

      const taxRate = document.createElement('p')
      taxRate.textContent = `Veroprosentti: ${income.taxRate}`
      card.appendChild(taxRate)

      const date = document.createElement('p')
      date.textContent = `Päivämäärä: ${moment(income.date).format('DD.MM.YYYY')}`
      card.appendChild(date)

      // Luodaan editButton, joka lisätään jokaiseen korttiin
      const editButton = document.createElement('span')
      let penIcon = document.createElement('i')
      penIcon.classList.add('fas', 'fa-pen-to-square', 'fa-l',) 
      editButton.appendChild(penIcon)
      editButton.className = 'edit-button'
      editButton.addEventListener('click', () => editIncome(income))
      card.appendChild(editButton)

      // Luodaan deleteButton, joka lisätään jokaiseen korttiin
      const deleteButton = document.createElement('span')
      let icon = document.createElement('i')
      icon.classList.add('fas', 'fa-trash', 'fa-l') 
      deleteButton.appendChild(icon)
      deleteButton.className = 'delete-button'
      deleteButton.addEventListener('click', () => deleteIncome(income._id))
      card.appendChild(deleteButton)

      cardContainer.appendChild(card)
    })
  }
}

// Funktio, joka tyhjentää input-kentät
function clearIncomeFields() {
  document.getElementById('income').value = ''
  document.getElementById('netIncome').value = ''
  document.getElementById('incomeCategory').value = ''
  document.getElementById('taxRate').value = ''
  document.getElementById('incomeDate').value = ''
}

// Funktio, jonka avulla voidaan poistaa tulo DELETE-metodilla
function deleteIncome(incomeId) {
  try {
    fetch(siteUrl + `/incomes/${incomeId}`, {
      method: 'DELETE',
    }).then(() => {
      allIncomes = allIncomes.filter(income => income._id !== incomeId)
      newIncomes = newIncomes.filter(income => income._id !== incomeId)
      showIncomes()
      searchIncomes()
    })
  } catch (error) {
    console.log('Error deleting income:', error.message)
  }
}

// Funktio, jonka avulla voidaan muokata tuloa
function editIncome(income) {
  // Haetaan incomeForm, jossa on kaikki input-kentät
  const incomeForm = document.getElementById('incomeForm')
  incomeForm.income.value = income.income
  incomeForm.netIncome.value = income.netIncome
  incomeForm.taxRate.value = income.taxRate
  incomeForm.incomeCategory.value = income.category
  incomeForm.incomeDate.value = moment(income.date).format('YYYY-MM-DD')

  // Scrollataan sivulla incomeFormin kohdalle
  incomeForm.scrollIntoView({behavior: 'smooth'})

  // Luodaan muuttuja incomeFormButton, joka hakee id:n perusteella incomeFormButton-elementin ja muuttaa siihen teksti "Tallenna muutokset"
  const incomeFormButton = document.getElementById('incomeFormButton')
  incomeFormButton.textContent = 'Tallenna muutokset'
  // Kun painetaan "Tallenna muutokset"-nappia, kutsutaan funktiota updateIncome, joka päivittää tulon
  incomeFormButton.onclick = function () {
    // Tarkistetaan napin nykyinen teksti, jotta voidaan päättää onko kyseessä "update" vai "add"
    if (incomeFormButton.textContent === 'Tallenna muutokset') {
      // Jos "Tallenna muutokset", päivitetään tulo
      updateIncome(income._id, incomeForm)
    } else {
      // Jos lisää tulo, lisätään uusi tulo
      addIncome()
    }
    // Resetoidaan form, kun tulo on päivitetty/lisätty
    incomeForm.reset()
    // Palautetaan teksti takaisin "Lisää tulo"-tekstiksi
    incomeFormButton.textContent = 'Lisää tulo'
  };
}

// Funktio, joka päivittää tulon PUT-metodilla
async function updateIncome(incomeId, updatedIncomeData) {
  try {
    const response = await fetch(siteUrl + `/incomes/${incomeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        income: updatedIncomeData.income.value,
        category: updatedIncomeData.incomeCategory.value,
        netIncome: updatedIncomeData.netIncome.value,
        taxRate: updatedIncomeData.taxRate.value,
        date: updatedIncomeData.incomeDate.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Error updating income')
    }

    const updatedIncome = await response.json()

    // Päivitetään vanha tulo uudella, päivitetyllä tulolla
    // Lisätään uusi tulo allIncomes-muuttujaan
    const index = allIncomes.findIndex((income) => income._id === updatedIncome._id)
    if (index !== -1) {
      allIncomes[index] = updatedIncome
    }

    // Lisätään uusi tulo newIncomes-muuttujaan
    const newIndex = newIncomes.findIndex((income) => income._id === updatedIncome._id)
    if (newIndex !== -1) {
      newIncomes[newIndex] = updatedIncome
    }

    // Kutsutaan funktiota searchIncomes, joka näyttää käyttäjälle hakutulokset
    // Kutsutaan funktiota showIncomes, joka näyttää käyttäjälle lisätyt tulot
    // Kutsutaan funktiota clearIncomeFields, joka tyhjentää input-kentät
    searchIncomes()
    showIncomes()
    clearIncomeFields()
  } catch (error) {
    console.error('Error updating income:', error)
  }
}

// Funktio checkSearchInputs tarkistaa, ovatko hakukentät tyhjiä
function checkSearchInputs(searchInputs) {
  searchInputs.hasError = true
  searchInputs.inputElements.forEach((input) => {
    if (input.value) {
      searchInputs.hasError = false
    }
  })
  // Jos hakukentät tyhjiä, näytetään virheilmoitus
  if (searchInputs.hasError) {
    searchInputs.errorElement.style.display = 'block'
  }
  else {
    // Jos haku onnistuu, display = none
    searchInputs.errorElement.style.display = 'none'
  }
}

// Lisätään kuuntelija, joka kutsuu checkSearchInput-funktiota aina kun hakukenttiin syötetään jotain
function addSearchInputListener(form, searchInputs) {
  form.addEventListener('input', function (event) {
    checkSearchInputs(searchInputs)
  })
}

// Funktio, joka hakee tulot hakukenttien perusteella
async function searchIncomes() {
  const incomeSearchForm = document.getElementById('incomeSearchForm')
  const category = incomeSearchForm.incomeCategorySearch.value
  const yearMonthInput = incomeSearchForm.incomeDateSearch.value
  const searchResultsList = document.getElementById('searchIncomeResults')

  
   // Jos kenttä/kentät ovat tyhjiä, näytetään virheilmoitus
  const searchIncomeInputs = {inputElements: [incomeSearchForm.incomeCategorySearch, incomeSearchForm.incomeDateSearch], errorElement: document.getElementById('errorIncomeSearch'), errorMessage: 'Valitse kategoria (muu kuin "kaikki") tai päivämäärä tai molemmat', hasError: true }
  searchIncomeInputs.errorElement.textContent = searchIncomeInputs.errorMessage
  checkSearchInputs(searchIncomeInputs)

  if (searchIncomeInputs.hasError) {
    addSearchInputListener(incomeSearchForm, searchIncomeInputs)
    return
  }

  // Jos allIncomes-muuttujassa on jotain, käydään läpi jokainen tulo ja luodaan kortti, joka näyttää tulon tiedot
  if (allIncomes.length > 0) {
    const filteredIncomes = allIncomes.filter(income => {
      const isMatchingCategory = category === '' || income.category === category
      const isMatchingDate = yearMonthInput === '' || moment(income.date).format('YYYY-MM') === yearMonthInput
      return isMatchingCategory && isMatchingDate
    })

    // Slice() tekee kopion filteredIncomes-muuttujasta, jotta alkuperäinen ei muutu
    // Lajitellaan tulot päivämäärän mukaan
    // Käytetään reverse(), jotta saadaan viimeisin tulo näytettyä ensimmäisenä
    const sortedFilteredIncomes = filteredIncomes
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reverse();

    // Tarkista, onko hakutuloksia
    if (sortedFilteredIncomes.length === 0) {
    // Näytä teksti "Ei hakutuloksia"
    searchResultsList.innerHTML = '<p>Ei hakutuloksia</p>'
    } 
    else {
    // Kutsutaan funktiota showIncomes, joka näyttää käyttäjälle lisätyt tulot tämän haun perusteella
    showIncomes(searchResultsList, sortedFilteredIncomes)
    }
  }
}


// Lisätään maksu
async function addPayment() {
  const paymentForm = document.getElementById('paymentForm')
  const amountValue = paymentForm.paymentAmount.value
  const descriptionValue = paymentForm.paymentDescription.value
  const paymentCategory = paymentForm.paymentCategory.value
  const dateValue = paymentForm.paymentDate.value

  // Kaikki errorPaymentInputs-kentät, joissa on inputElement, errorElement, errorMessage ja hasError
  // Asetetaan hasError = false, eli oletuksena ei erroreita
  const errorPaymentInputs = [
    { inputElement: paymentForm.paymentAmount, errorElement: document.getElementById('errorAmount'), errorMessage: 'Maksu-kenttä ei saa olla tyhjä.', hasError: false },
    { inputElement: paymentForm.paymentCategory, errorElement: document.getElementById('errorPaymentCategory'), errorMessage: 'Kategoria-kenttä ei saa olla tyhjä.', hasError: false },
    { inputElement: paymentForm.paymentDate, errorElement: document.getElementById('errorPaymentDate'), errorMessage: 'Päivämäärä-kenttä ei saa olla tyhjä.', hasError: false },
  ]
  
  let hasPaymentError = false

  // Näytetään virheilmoitus, jos jokin kentistä on tyhjä
  errorPaymentInputs.forEach((input) => {
    input.errorElement.textContent = input.errorMessage
    showError(input)
  });

  // Jos jokin kentistä on tyhjä, asetetaan hasPaymentError todeksi
  hasPaymentError = errorPaymentInputs.some((input) => input.hasError)
  
  // Jos hasPaymentError on tosi, kutsutaan addInputListeners-funktiota, joka näyttää virheilmoituksen/t
  if (hasPaymentError) {
    addInputListeners(paymentForm, errorPaymentInputs)
    return
  }

  // Jos kaikki kentät on oikein täytetty, lisätään maksu tietokantaan POST-metodilla
  try {
    const response = await fetch(siteUrl + '/payments', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountValue,
        description: descriptionValue,
        category: paymentCategory,
        date: dateValue
      })
    })

    if (!response.ok) {
      throw new Error('Server responded with an error')
    }
    const payment = await response.json()
    console.log('Payment added:', payment)
    // Lisätään maksu allPayments- ja newPayments-muuttujiin
    allPayments.push(payment)
    newPayments.push(payment)
  } catch (error) {
    console.error('Virhe lisättäessä maksua:', error.message)
  }
  // Kutsutaan funktiota showPayments, joka näyttää käyttäjälle lisätyt maksut
  // Kutsutaan funktiota searchPayments, joka näyttää käyttäjälle hakutulokset
  // Kutsutaan funktiota clearPaymentFields, joka tyhjentää input-kentät
  showPayments()
  searchPayments()
  clearPaymentFields()
}

// Ladataan kaikki maksut tietokannasta, kutsutaan showPayments-funktiota
async function loadPayments() {
  try {
    let url = siteUrl + '/payments'
    const response = await fetch(url)
    allPayments = await response.json()
    showPayments()
  } catch (error) {
    console.error('Error loading payments:', error)
  }
}

// Funktio, joka näyttää maksut käyttäjälle
function showPayments(cardContainer = null, filteredPayments = null) {
  // Jos cardContainer on tyhjä, käytetään paymentCards-elementtiä
  if (!cardContainer) { cardContainer = document.getElementById('paymentCards')}
  cardContainer.innerHTML = ''

  // Jos filteredPayments on tyhjä, käytetään newPayments-muuttujaa
  const payments = filteredPayments ?? newPayments
  // Jos payments-muuttujassa on jotain (sen pituus on isompi kuin 0)
  // käydään läpi jokainen maksu ja luodaan kortti, joka näyttää maksun tiedot
  if (payments.length > 0) {
    payments.reverse().forEach(payment => {
      const card = document.createElement('div')
      card.className = 'card'

      const title = document.createElement('h3')
      title.textContent = `Määrä: ${payment.amount} | Kategoria: ${payment.category}`
      card.appendChild(title)

      const amount = document.createElement('p')
      amount.textContent = `Kuvaus: ${payment.description}`
      card.appendChild(amount)

      const date = document.createElement('p')
      date.textContent = `Päivämäärä: ${moment(payment.date).format('DD.MM.YYYY')}`
      card.appendChild(date)

      // Luodaan editButton, joka lisätään jokaiseen korttiin
      const editButton = document.createElement('span')
      editButton.className = 'edit-button'
      let penIcon = document.createElement('i')
      penIcon.classList.add('fas', 'fa-pen-to-square', 'fa-l') 
      editButton.appendChild(penIcon)
      editButton.addEventListener('click', () => editPayment(payment))
      card.appendChild(editButton)

      // Luodaan deleteButton, joka lisätään jokaiseen korttiin
      const deleteButton = document.createElement('span')
      let icon = document.createElement('i')
      icon.classList.add('fas', 'fa-trash', 'fa-l') 
      deleteButton.appendChild(icon)
      deleteButton.className = 'delete-button'
      deleteButton.addEventListener('click', () => deletePayment(payment._id))
      card.appendChild(deleteButton)

      cardContainer.appendChild(card)
    })
  }
}

// Funktio, joka tyhjentää input-kentät
function clearPaymentFields() {
  document.getElementById('paymentDescription').value = ''
  document.getElementById('paymentAmount').value = ''
  document.getElementById('paymentCategory').value = ''
  document.getElementById('paymentDate').value = ''
}

// Funktio, jonka avulla voidaan poistaa maksu DELETE-metodilla
function deletePayment(paymentId) {
  try {
    fetch(siteUrl + `/payments/${paymentId}`, {
      method: 'DELETE',
    }).then(() => {
      // Poistetaan maksu allPayments- ja newPayments-muuttujista
      allPayments = allPayments.filter(payment => payment._id !== paymentId)
      newPayments = newPayments.filter(payment => payment._id !== paymentId)
      // Kun maksu on poistettu, kutsutaan funktiota showPayments, joka näyttää käyttäjälle maksut
      // Kutsutaan funktiota searchPayments, joka näyttää käyttäjälle hakutulokset
      showPayments()
      searchPayments()
    })
  } catch (error) {
    console.log('Error deleting payment:', error.message)
  }
}

// Funktio, jonka avulla voidaan muokata maksua
function editPayment(payment) {
  const paymentForm = document.getElementById('paymentForm')
  paymentForm.paymentAmount.value = payment.amount
  paymentForm.paymentDescription.value = payment.description
  paymentForm.paymentCategory.value = payment.category
  paymentForm.paymentDate.value = moment(payment.date).format('YYYY-MM-DD')

  // Scrollataan sivulla paymentFormin kohdalle
  paymentForm.scrollIntoView({behavior: 'smooth'})

  // Luodaan muuttuja paymentFormButton, joka hakee id:n perusteella paymentFormButton-elementin ja muuttaa siihen teksti "Tallenna muutokset"
  const paymentFormButton = document.getElementById('paymentFormButton')
  paymentFormButton.textContent = 'Tallenna muutokset'
  paymentFormButton.onclick = function () {
    // Tarkistetaan napin nykyinen teksti, jotta voidaan päättää onko kyseessä "update" vai "add"
    if (paymentFormButton.textContent === 'Tallenna muutokset') {
      // Jos "Tallenna muutokset", päivitetään maksu
      updatePayment(payment._id, paymentForm);
    } else {
      // Jos lisää maksu, lisätään uusi maksu
      addPayment();
    }
    // Resetoidaan form, kun maksu on päivitetty/lisätty
    paymentForm.reset();
    // Palautetaan teksti takaisin "Lisää maksu"-tekstiksi
    paymentFormButton.textContent = 'Lisää maksu'
  }
}

// Funktio, joka päivittää maksun PUT-metodilla
async function updatePayment(paymentId, updatedPaymentData) {
  try {
    const response = await fetch(siteUrl + `/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: updatedPaymentData.paymentAmount.value,
        description: updatedPaymentData.paymentDescription.value,
        category: updatedPaymentData.paymentCategory.value,
        date: updatedPaymentData.paymentDate.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Error updating payment')
    }

    const updatedPayment = await response.json()

    // Päivitetään vanha maksu uudella, päivitetyllä maksulla, lisätään uusi maksu allPayments-muuttujaan
    const index = allPayments.findIndex((payment) => payment._id === updatedPayment._id)
    if (index !== -1) {
      allPayments[index] = updatedPayment
    }

    // Lisätään uusi maksu newPayments-muuttujaan
    const newIndex = newPayments.findIndex((payment) => payment._id === updatedPayment._id)
    if (newIndex !== -1) {
      newPayments[newIndex] = updatedPayment
    }

    // Kutsutaan funktiota searchPayments, joka näyttää käyttäjälle hakutulokset
    // Kutsutaan funktiota showPayments, joka näyttää käyttäjälle lisätyt maksut
    // Kutsutaan funktiota clearPaymentFields, joka tyhjentää input-kentät
    searchPayments()
    showPayments()
    clearPaymentFields()
  } catch (error) {
    console.error('Error updating payment:', error)
  }
}

// Funktio, joka etsii maksuja hakukenttien perusteella
async function searchPayments() {
  const paymentSearchForm = document.getElementById('paymentSearchForm')
  const category = paymentSearchForm.paymentCategorySearch.value
  const yearMonthInput = paymentSearchForm.paymentDateSearch.value
  const searchResultsList = document.getElementById('searchPaymentResults')

  // Jos kenttä/kentät ovat tyhjiä, näytetään virheilmoitus
  const searchPaymentInputs = {inputElements: [paymentSearchForm.paymentCategorySearch, paymentSearchForm.paymentDateSearch], errorElement: document.getElementById('errorPaymentSearch'), errorMessage: 'Valitse kategoria (muu kuin "kaikki") tai päivämäärä tai molemmat', hasError: true }
  searchPaymentInputs.errorElement.textContent = searchPaymentInputs.errorMessage
  checkSearchInputs(searchPaymentInputs)

  // Jos errorPaymentInputs.hasError on tosi, kutsutaan addSearchInputListener-funktiota, joka näyttää virheilmoituksen
  if (searchPaymentInputs.hasError) {
    addSearchInputListener(paymentSearchForm, searchPaymentInputs)
    return
  }

  // Jos allPayments-muuttujassa on jotain, käydään läpi jokainen maksu ja luodaan kortti, joka näyttää maksun tiedot
  if (allPayments.length > 0) {
    const filteredPayments = allPayments.filter(payment => {
      const isMatchingCategory = category === '' || payment.category === category
      const isMatchingDate = yearMonthInput === '' || moment(payment.date).format('YYYY-MM') === yearMonthInput
      return isMatchingCategory && isMatchingDate
    })

    // Slice() tekee kopion filteredPayments-muuttujasta, jotta alkuperäinen ei muutu
    // Lajitellaan maksut päivämäärän mukaan
    // Käytetään reverse(), jotta saadaan viimeisin maksu näytettyä ensimmäisenä
    const sortedFilteredPayments = filteredPayments
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reverse()


    // Tarkista, onko hakutuloksia
    if (sortedFilteredPayments.length === 0) {
      // Näytä teksti "Ei hakutuloksia"
      searchResultsList.innerHTML = '<p>Ei hakutuloksia</p>'
      } 
      else {
      // Kutsutaan funktiota showPayments, joka näyttää käyttäjälle lisätyt maksut tämän haun perusteella
      showPayments(searchResultsList, sortedFilteredPayments)
      }
    }
}
