function init() {
  console.log('Initializing the application...')
  loadIncomes()
  loadPayments()

  const incomeInput = document.getElementById('income')
  const taxRateInput = document.getElementById('taxRate')

  function updateNetIncome() {
    const incomeInput = document.getElementById('income')
    const taxRateInput = document.getElementById('taxRate')
    const netIncomeInput = document.getElementById('netIncome')

    const incomeValue = parseFloat(incomeInput.value)
    const taxRateValue = parseFloat(taxRateInput.value)

    console.log('Income:', incomeValue, 'Tax Rate:', taxRateValue)

    if (isNaN(incomeValue) || isNaN(taxRateValue)) {
      console.log('Invalid values. Please enter valid numbers.')
      netIncomeInput.value = ''
      return;
    }

    const calculatedNetIncome = calculateNetIncome(incomeValue, taxRateValue)
    console.log('Calculated Net Income:', calculatedNetIncome)

    netIncomeInput.value = calculatedNetIncome
  }

  incomeInput.addEventListener('input', updateNetIncome)
  taxRateInput.addEventListener('input', updateNetIncome)

  console.log('Application initialized.')
}

document.addEventListener('DOMContentLoaded', init)

async function addIncome() {
  const incomeValue = document.getElementById('income').value.trim()
  const incomeCategory = document.getElementById('incomeCategory').value.trim()
  const taxRateValue = document.getElementById('taxRate').value.trim()
  const dateValue = document.getElementById('incomeDate').value.trim()
  const netIncomeInput = document.getElementById('netIncome')

  console.log('incomeCategory:', incomeCategory);

  try {
    if (incomeValue === '' || incomeCategory === '' || taxRateValue === '' || dateValue === '') {
      throw new Error('Täytä kaikki tulojen lisäykseen tarvittavat kentät.')
    }

    const netIncome = calculateNetIncome(incomeValue, taxRateValue) // Kahdesti!?
    netIncomeInput.value = netIncome;

    const formattedDate = moment(dateValue, 'DD-MM-YYYY').format('YYYY-MM-DD')

    console.log('Lähetetään POST-pyyntö:')
    console.log('URL: https://budjetti-back.onrender.com/incomes')
    console.log('Body:', JSON.stringify({
      income: incomeValue,
      category: incomeCategory,
      netIncome: netIncome,
      taxRate: taxRateValue,
      date: formattedDate
    }))

    try {
      const response = await fetch('https://budjetti-back.onrender.com/incomes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          income: incomeValue,
          category: incomeCategory,
          netIncome: netIncome,
          taxRate: taxRateValue,
          date: formattedDate
        })
      })

      loadIncomes()
      clearIncomeFields()
    } catch (error) {
      console.error('Virhe lisättäessä tuloa:', error.message)
    }
  } catch (error) {
    console.error('Virhe lisättäessä tuloa:', error.message)
  }
}

function calculateNetIncome(income, taxRate) {
  console.log('Calculating net income:', income, taxRate)
  const netIncome = (income - (income * taxRate / 100)).toFixed(2)
  console.log('Net income:', netIncome)
  return netIncome
}

async function loadIncomes() {
  try {
    const response = await fetch('https://budjetti-back.onrender.com/incomes');
if (!response.ok) {
  throw new Error('Error loading incomes: ' + response.statusText);
}
const incomes = await response.json();
showIncomes(incomes);


    const netIncomeInput = document.getElementById('netIncome')
    netIncomeInput.value = null
  } catch (error) {
    console.error('Error loading incomes:', error);
    if (response) {
      console.error('Response status:', response.status);
      console.error('Response text:', await response.text());
    }
  }
}

function showIncomes(incomes) {
  const incomeList = document.getElementById('incomeList')
  const netIncomeInput = document.getElementById('netIncome')
  incomeList.innerHTML = ''

  if (incomes && incomes.length > 0) {
    incomes.forEach(income => {
      const li = document.createElement('li')
      li.textContent = `Tulo: ${income.income} | Kategoria: ${income.category} | Nettotulo: ${income.netIncome} | Veroprosentti: ${income.taxRate} | Päivämäärä: ${income.date}`
      incomeList.appendChild(li)

      netIncomeInput.value = income.netIncome
    });
  } else {
    netIncomeInput.value = ''
  }
}

function clearIncomeFields() {
  document.getElementById('income').value = ''
  document.getElementById('incomeCategory').value = ''
  document.getElementById('netIncome').value = ''
  document.getElementById('taxRate').value = ''
  document.getElementById('incomeDate').value = ''
}

async function addPayment() {
  const descriptionValue = document.getElementById('paymentDescription').value
  const amountValue = document.getElementById('paymentAmount').value
  const categoryValue = document.getElementById('paymentCategory').value
  const dateValue = document.getElementById('paymentDate').value

  const formattedDate = moment(dateValue, 'DD-MM-YYYY').format('YYYY-MM-DD')

  try {
    const response = await fetch('https://budjetti-back.onrender.com/payments', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: descriptionValue,
        amount: amountValue,
        category: categoryValue,
        date: formattedDate
      })
    });

    if (!response.ok) {
      throw new Error('Maksun lisääminen epäonnistui')
    }

    loadPayments()
    clearPaymentFields()
  } catch (error) {
    console.error('Virhe lisättäessä maksua:', error)
  }
}

async function loadPayments() {
  try {
    const response = await fetch('https://budjetti-back.onrender.com/payments')
    const payments = await response.json()
    showPayments(payments);
  } catch (error) {
    console.error('Virhe ladattaessa maksuja:', error)
  }
}

function showPayments(payments) {
  const paymentList = document.getElementById('paymentList')
  paymentList.innerHTML = ''

  payments.forEach(payment => {
    const li = document.createElement('li')
    li.textContent = `Kuvaus: ${payment.description} | Määrä: ${payment.amount} | Kategoria: ${payment.category} | Päivämäärä: ${payment.date}`
    paymentList.appendChild(li)
  });
}

function clearPaymentFields() {
  document.getElementById('paymentDescription').value = ''
  document.getElementById('paymentAmount').value = ''
  document.getElementById('paymentCategory').value = ''
  document.getElementById('paymentDate').value = ''
}

document.addEventListener('DOMContentLoaded', function () {
  const incomeCategoryInput = document.getElementById('incomeCategory')

  incomeCategoryInput.addEventListener('change', function () {
    this.style.outline = 'none'
  })
})
